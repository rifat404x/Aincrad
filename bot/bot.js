// ╔══════════════════════════════════════════════╗
// ║  NEBULA USER MANAGER BOT v2.0              ║
// ║  AUTHOR: Abdullah Al Mamun (@A2MBD3)       ║
// ║  SIMPLE BUTTON UI + STEP-BY-STEP ADD       ║
// ╚══════════════════════════════════════════════╝

const express = require('express');
const fetch = require('node-fetch');
const { Buffer } = require('buffer');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER_ID = (process.env.ADMIN_IDS || '').split(',')[0].trim();
const REPO = 'A2MBD3/Aincrad';
const FILE_PATH = 'assets/users.json';
const API = `https://api.telegram.org/bot${TOKEN}`;
const GH_API = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

// ═══════════════════════════════════════════════
// SESSION STORAGE (for step-by-step add)
// ═══════════════════════════════════════════════
const sessions = {};

// ═══════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════
app.get('/', (req, res) => res.send('⬡ NEBULA Bot v2.0 | @A2MBD3'));

// ═══════════════════════════════════════════════
// GITHUB API
// ═══════════════════════════════════════════════
const ghHeaders = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'NebulaBot/2.0'
};

async function getUsers() {
  const res = await fetch(GH_API + '?t=' + Date.now(), { headers: ghHeaders });
  const data = await res.json();
  const decoded = Buffer.from(data.content, 'base64').toString('utf8');
  return { users: JSON.parse(decoded).users || [], sha: data.sha };
}

async function saveUsers(users, sha, msg) {
  await fetch(GH_API, {
    method: 'PUT',
    headers: { ...ghHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `🤖 ${msg}`,
      content: Buffer.from(JSON.stringify({ users }, null, 2)).toString('base64'),
      sha
    })
  });
}

// ═══════════════════════════════════════════════
// TELEGRAM HELPERS
// ═══════════════════════════════════════════════
async function sendMessage(chatId, text, markup) {
  const body = { chat_id: chatId, text, parse_mode: 'HTML' };
  if (markup) body.reply_markup = markup;
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function answerCallback(cbId, text) {
  await fetch(`${API}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: cbId, text, show_alert: false })
  });
}

// ═══════════════════════════════════════════════
// KEYBOARDS
// ═══════════════════════════════════════════════
function mainMenu(isOwner) {
  const buttons = [
    [{ text: '👥 USER LIST', callback_data: 'list' }],
    [{ text: '➕ ADD USER', callback_data: 'add_start' }],
  ];
  if (isOwner) {
    buttons.push([{ text: '📊 STATS', callback_data: 'stats' }]);
    buttons.push([{ text: '✏️ EDIT USER', callback_data: 'edit_menu' }]);
    buttons.push([{ text: '🔧 MANAGE', callback_data: 'manage_menu' }]);
  }
  return { inline_keyboard: buttons };
}

function manageMenu() {
  return {
    inline_keyboard: [
      [{ text: '🚫 BAN USER', callback_data: 'ban_menu' }],
      [{ text: '✅ UNBAN USER', callback_data: 'unban_menu' }],
      [{ text: '🗑 DELETE USER', callback_data: 'delete_menu' }],
      [{ text: '🔙 BACK', callback_data: 'back' }],
    ]
  };
}

function userListButtons(users) {
  const buttons = users.slice(0, 20).map(u => ([
    { text: `${u.banned ? '🚫' : '✅'} ${u.name}`, callback_data: `view_${u.id}` }
  ]));
  buttons.push([{ text: '🔙 BACK', callback_data: 'back' }]);
  return { inline_keyboard: buttons };
}

function backButton() {
  return { inline_keyboard: [[{ text: '🔙 BACK', callback_data: 'back' }]] };
}

function cancelButton() {
  return { inline_keyboard: [[{ text: '❌ CANCEL', callback_data: 'back' }]] };
}

// ═══════════════════════════════════════════════
// HANDLERS
// ═══════════════════════════════════════════════

// ── MAIN MENU ──────────────────────────────────
async function showMainMenu(chatId) {
  const isOwner = chatId.toString() === OWNER_ID;
  await sendMessage(chatId,
    '<b>⬡ NEBULA USER MANAGER v2.0</b>\n\n' +
    'Welcome! Choose an option:\n\n' +
    '<i>By @A2MBD3</i>',
    mainMenu(isOwner)
  );
}

// ── USER LIST ──────────────────────────────────
async function showUserList(chatId) {
  const { users } = await getUsers();
  if (!users.length) {
    return sendMessage(chatId, '📋 No users yet!', backButton());
  }
  let text = '<b>👥 USERS</b>\n\n';
  users.forEach(u => {
    text += `${u.banned ? '🚫' : '✅'} <b>${u.name}</b> (ID:${u.id})\n`;
  });
  await sendMessage(chatId, text, userListButtons(users));
}

// ── VIEW USER ──────────────────────────────────
async function viewUser(chatId, userId) {
  const { users } = await getUsers();
  const u = users.find(x => x.id === userId);
  if (!u) return sendMessage(chatId, '❌ Not found!', backButton());

  const isOwner = chatId.toString() === OWNER_ID;
  const buttons = [];
  
  if (isOwner) {
    buttons.push([
      { text: '✏️ EDIT', callback_data: `edit_${u.id}` },
      { text: u.banned ? '✅ UNBAN' : '🚫 BAN', callback_data: u.banned ? `unban_${u.id}` : `ban_${u.id}` },
      { text: '🗑 DELETE', callback_data: `delete_${u.id}` },
    ]);
  }
  buttons.push([{ text: '🔙 BACK', callback_data: 'list' }]);

  await sendMessage(chatId,
    `<b>👤 USER DETAILS</b>\n\n` +
    `🆔 ID: ${u.id}\n` +
    `📛 Name: ${u.name}\n` +
    `📢 Channel: ${u.tgChannel === '0' ? 'None' : u.tgChannel}\n` +
    `🔑 Password: ${u.password === '0' ? 'None' : 'Yes'}\n` +
    `🚫 Banned: ${u.banned ? 'Yes' : 'No'}\n\n` +
    `<b>📋 Bookmarklet:</b>\n` +
    `<code>javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${u.id};` +
    `var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];` +
    `fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();</code>`,
    { inline_keyboard: buttons }
  );
}

// ── ADD USER (STEP BY STEP) ────────────────────
async function startAddUser(chatId) {
  sessions[chatId] = { step: 'name', data: {} };
  await sendMessage(chatId, 
    '➕ <b>ADD NEW USER</b>\n\n' +
    '<b>Step 1/3:</b> Enter user name:',
    cancelButton()
  );
}

async function handleAddStep(chatId, text) {
  const session = sessions[chatId];
  if (!session) return;

  switch (session.step) {
    case 'name':
      session.data.name = text;
      session.step = 'password';
      await sendMessage(chatId,
        `✅ Name: <b>${text}</b>\n\n` +
        '<b>Step 2/3:</b> Enter password\n' +
        '(Type <b>0</b> for no password)',
        cancelButton()
      );
      break;

    case 'password':
      session.data.password = text;
      session.step = 'channel';
      await sendMessage(chatId,
        `✅ Password: <b>${text}</b>\n\n` +
        '<b>Step 3/3:</b> Enter Telegram channel\n' +
        '(Type <b>0</b> for no channel)\n' +
        'Example: <code>t.me/username</code>',
        cancelButton()
      );
      break;

    case 'channel':
      session.data.channel = text;
      await finishAddUser(chatId, session);
      break;
  }
}

async function finishAddUser(chatId, session) {
  const { users, sha } = await getUsers();
  
  // Auto-generate ID (next available)
  const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
  const newId = maxId + 1;
  
  const newUser = {
    id: newId,
    name: session.data.name,
    tgChannel: session.data.channel,
    password: session.data.password,
    banned: 0
  };

  users.push(newUser);
  await saveUsers(users, sha, `Add ${newUser.name} (ID:${newId})`);

  delete sessions[chatId];

  const bookmarklet = `javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${newId};` +
    `var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];` +
    `fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();`;

  await sendMessage(chatId,
    '✅ <b>USER CREATED!</b>\n\n' +
    `🆔 ID: ${newId}\n` +
    `📛 Name: ${newUser.name}\n` +
    `📢 Channel: ${newUser.tgChannel}\n` +
    `🔑 Password: ${newUser.password}\n\n` +
    '<b>📋 Share this bookmarklet:</b>\n' +
    `<code>${bookmarklet}</code>\n\n` +
    '<i>Copy and share with the user!</i>',
    backButton()
  );
}

// ── STATS ───────────────────────────────────────
async function showStats(chatId) {
  const { users } = await getUsers();
  await sendMessage(chatId,
    '<b>📊 STATISTICS</b>\n\n' +
    `👥 Total: ${users.length}\n` +
    `✅ Active: ${users.filter(u => !u.banned).length}\n` +
    `🚫 Banned: ${users.filter(u => u.banned).length}\n` +
    `🔑 With Pass: ${users.filter(u => u.password !== '0').length}\n` +
    `📢 With Channel: ${users.filter(u => u.tgChannel !== '0').length}`,
    backButton()
  );
}

// ═══════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════
async function handleUpdate(update) {
  // Handle callback queries (button clicks)
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;

    await answerCallback(cb.id, '');

    if (data === 'back') return showMainMenu(chatId);
    if (data === 'list') return showUserList(chatId);
    if (data === 'add_start') return startAddUser(chatId);
    if (data === 'stats') return showStats(chatId);

    if (data.startsWith('view_')) {
      return viewUser(chatId, parseInt(data.replace('view_', '')));
    }

    if (data.startsWith('ban_')) {
      const id = parseInt(data.replace('ban_', ''));
      const { users, sha } = await getUsers();
      const u = users.find(x => x.id === id);
      if (u) { u.banned = 1; await saveUsers(users, sha, `Ban ${u.name}`); }
      return viewUser(chatId, id);
    }

    if (data.startsWith('unban_')) {
      const id = parseInt(data.replace('unban_', ''));
      const { users, sha } = await getUsers();
      const u = users.find(x => x.id === id);
      if (u) { u.banned = 0; await saveUsers(users, sha, `Unban ${u.name}`); }
      return viewUser(chatId, id);
    }

    if (data.startsWith('delete_')) {
      const id = parseInt(data.replace('delete_', ''));
      const { users, sha } = await getUsers();
      const idx = users.findIndex(x => x.id === id);
      if (idx > -1) {
        const name = users[idx].name;
        users.splice(idx, 1);
        await saveUsers(users, sha, `Delete ${name}`);
        await sendMessage(chatId, `🗑 <b>${name}</b> deleted!`, backButton());
      }
      return;
    }

    return;
  }

  // Handle text messages
  if (update.message) {
    const { chat, text } = update.message;
    const chatId = chat.id;
    const cmd = (text || '').toLowerCase();

    // Check if in add-user session
    if (sessions[chatId]) {
      if (cmd === '/cancel') {
        delete sessions[chatId];
        return sendMessage(chatId, '❌ Cancelled.', backButton());
      }
      return handleAddStep(chatId, text);
    }

    // Commands
    if (cmd === '/start') return showMainMenu(chatId);
    if (cmd === '/add') return startAddUser(chatId);
    if (cmd === '/list') return showUserList(chatId);
    if (cmd === '/cancel') {
      delete sessions[chatId];
      return sendMessage(chatId, '✅ Done.', backButton());
    }
  }
}

// ═══════════════════════════════════════════════
// POLLING
// ═══════════════════════════════════════════════
let offset = 0;
async function poll() {
  try {
    const res = await fetch(`${API}/getUpdates?offset=${offset}&timeout=30`);
    const data = await res.json();
    if (data.result) {
      for (const update of data.result) {
        offset = update.update_id + 1;
        await handleUpdate(update);
      }
    }
  } catch (e) {}
  poll();
}

// ═══════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`⬡ NEBULA Bot v2.0 | Port: ${PORT} | @A2MBD3`);
  poll();
});