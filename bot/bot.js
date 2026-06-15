// ╔══════════════════════════════════════════════╗
// ║  NEBULA USER MANAGER BOT v2.0              ║
// ║  AUTHOR: Abdullah Al Mamun (@A2MBD3)       ║
// ║  INLINE EDIT - SINGLE MESSAGE UI           ║
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
// SESSION
// ═══════════════════════════════════════════════
const sessions = {};

// ═══════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════
app.get('/', (req, res) => res.send('⬡ NEBULA Bot v2.0 | @A2MBD3'));

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

async function api(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function editMessage(chatId, msgId, text, markup) {
  return api('editMessageText', {
    chat_id: chatId,
    message_id: msgId,
    text,
    parse_mode: 'HTML',
    reply_markup: markup
  });
}

async function answerCb(cbId, text) {
  return api('answerCallbackQuery', { callback_query_id: cbId, text, show_alert: false });
}

// ═══════════════════════════════════════════════
// KEYBOARDS
// ═══════════════════════════════════════════════
function mainMenu(isOwner) {
  const b = [
    [{ text: '👥 USERS', callback_data: 'users' }],
    [{ text: '➕ ADD USER', callback_data: 'add_start' }],
  ];
  if (isOwner) {
    b.push([{ text: '📊 STATS', callback_data: 'stats' }]);
    b.push([{ text: '⚙️ SETTINGS', callback_data: 'settings' }]);
  }
  return { inline_keyboard: b };
}

function backBtn(data = 'home') {
  return { inline_keyboard: [[{ text: '🔙 BACK', callback_data: data }]] };
}

function cancelBtn() {
  return { inline_keyboard: [[{ text: '❌ CANCEL', callback_data: 'home' }]] };
}

function userListKB(users, page = 0) {
  const perPage = 8;
  const total = Math.ceil(users.length / perPage);
  const start = page * perPage;
  const slice = users.slice(start, start + perPage);
  
  const rows = slice.map(u => [{
    text: `${u.banned ? '🚫' : '✅'} ${u.name} (${u.id})`,
    callback_data: `view_${u.id}`
  }]);
  
  const nav = [];
  if (page > 0) nav.push({ text: '⬅️', callback_data: `users_${page - 1}` });
  nav.push({ text: `${page + 1}/${total}`, callback_data: 'noop' });
  if (page < total - 1) nav.push({ text: '➡️', callback_data: `users_${page + 1}` });
  if (nav.length) rows.push(nav);
  
  rows.push([{ text: '🔙 HOME', callback_data: 'home' }]);
  return { inline_keyboard: rows };
}

function userActionsKB(user, isOwner) {
  const rows = [];
  if (isOwner) {
    rows.push([
      { text: user.banned ? '✅ UNBAN' : '🚫 BAN', callback_data: `toggle_${user.id}` },
      { text: '🗑 DELETE', callback_data: `del_${user.id}` }
    ]);
  }
  rows.push([{ text: '🔙 USERS', callback_data: 'users' }]);
  return { inline_keyboard: rows };
}

// ═══════════════════════════════════════════════
// TEXT GENERATORS
// ═══════════════════════════════════════════════
function homeText(isOwner) {
  return (
    '<b>⬡ NEBULA USER MANAGER v2.0</b>\n\n' +
    'Manage users with buttons below.\n\n' +
    '<i>By @A2MBD3</i>'
  );
}

function usersText(users, page) {
  const perPage = 8;
  const start = page * perPage;
  const slice = users.slice(start, start + perPage);
  let t = `<b>👥 USERS (${users.length})</b>\n\n`;
  slice.forEach(u => {
    t += `${u.banned ? '🚫' : '✅'} <b>${u.name}</b>\n   ID:${u.id} | 🔑:${u.password === '0' ? 'N' : 'Y'}\n\n`;
  });
  t += `<i>Page ${page + 1}/${Math.ceil(users.length / perPage)}</i>`;
  return t;
}

function userText(u) {
  const bl = `javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${u.id};var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();`;
  return (
    `<b>👤 ${u.name}</b>\n\n` +
    `🆔 ID: ${u.id}\n` +
    `🔑 Password: ${u.password}\n` +
    `📢 Channel: ${u.tgChannel}\n` +
    `🚫 Banned: ${u.banned ? 'Yes' : 'No'}\n\n` +
    `<b>📋 Bookmarklet:</b>\n` +
    `<code>${bl}</code>`
  );
}

function statsText(users) {
  return (
    '<b>📊 STATS</b>\n\n' +
    `👥 Total: ${users.length}\n` +
    `✅ Active: ${users.filter(u => !u.banned).length}\n` +
    `🚫 Banned: ${users.filter(u => u.banned).length}`
  );
}

// ═══════════════════════════════════════════════
// ADD USER STEPS
// ═══════════════════════════════════════════════
function startAdd(chatId, msgId) {
  sessions[chatId] = { step: 'name', msgId, data: {} };
  editMessage(chatId, msgId,
    '➕ <b>ADD USER</b>\n\nStep 1/3: Enter <b>Name</b>:',
    cancelBtn()
  );
}

async function handleAddStep(chatId, text, msgId) {
  const s = sessions[chatId];
  if (!s) return;

  switch (s.step) {
    case 'name':
      s.data.name = text;
      s.step = 'password';
      await editMessage(chatId, msgId,
        `✅ Name: <b>${text}</b>\n\nStep 2/3: Enter <b>Password</b> (0 = none):`,
        cancelBtn()
      );
      break;
    case 'password':
      s.data.password = text;
      s.step = 'channel';
      await editMessage(chatId, msgId,
        `✅ Pass: <b>${text}</b>\n\nStep 3/3: Enter <b>Channel</b> (0 = none):`,
        cancelBtn()
      );
      break;
    case 'channel':
      s.data.channel = text;
      await finishAdd(chatId, msgId, s);
      break;
  }
}

async function finishAdd(chatId, msgId, s) {
  const { users, sha } = await getUsers();
  const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
  const newId = maxId + 1;
  
  const newUser = {
    id: newId,
    name: s.data.name,
    password: s.data.password,
    tgChannel: s.data.channel,
    banned: 0
  };

  users.push(newUser);
  await saveUsers(users, sha, `Add ${newUser.name}`);

  delete sessions[chatId];

  const bl = `javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${newId};var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();`;

  await editMessage(chatId, msgId,
    '✅ <b>USER CREATED!</b>\n\n' +
    `🆔 ID: ${newId}\n📛 ${newUser.name}\n\n` +
    '<b>Bookmarklet:</b>\n' +
    `<code>${bl}</code>`,
    { inline_keyboard: [[{ text: '🔙 HOME', callback_data: 'home' }], [{ text: '➕ ADD MORE', callback_data: 'add_start' }]] }
  );
}

// ═══════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════
async function handleUpdate(update) {
  // ── CALLBACK ──────────────────────────────────
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const msgId = cb.message.message_id;
    const data = cb.data;
    const isOwner = chatId.toString() === OWNER_ID;

    await answerCb(cb.id, '');

    // Navigation
    if (data === 'home') {
      return editMessage(chatId, msgId, homeText(isOwner), mainMenu(isOwner));
    }

    if (data === 'users') {
      const { users } = await getUsers();
      return editMessage(chatId, msgId, usersText(users, 0), userListKB(users, 0));
    }

    if (data.startsWith('users_')) {
      const page = parseInt(data.split('_')[1]);
      const { users } = await getUsers();
      return editMessage(chatId, msgId, usersText(users, page), userListKB(users, page));
    }

    if (data === 'add_start') {
      return startAdd(chatId, msgId);
    }

    if (data === 'stats') {
      const { users } = await getUsers();
      return editMessage(chatId, msgId, statsText(users), backBtn());
    }

    if (data.startsWith('view_')) {
      const id = parseInt(data.split('_')[1]);
      const { users } = await getUsers();
      const u = users.find(x => x.id === id);
      if (!u) return answerCb(cb.id, 'Not found!');
      return editMessage(chatId, msgId, userText(u), userActionsKB(u, isOwner));
    }

    if (data.startsWith('toggle_')) {
      const id = parseInt(data.split('_')[1]);
      const { users, sha } = await getUsers();
      const u = users.find(x => x.id === id);
      if (u) {
        u.banned = u.banned ? 0 : 1;
        await saveUsers(users, sha, `${u.banned ? 'Ban' : 'Unban'} ${u.name}`);
        return editMessage(chatId, msgId, userText(u), userActionsKB(u, isOwner));
      }
    }

    if (data.startsWith('del_')) {
      const id = parseInt(data.split('_')[1]);
      const { users, sha } = await getUsers();
      const idx = users.findIndex(x => x.id === id);
      if (idx > -1) {
        const name = users[idx].name;
        users.splice(idx, 1);
        await saveUsers(users, sha, `Delete ${name}`);
        return editMessage(chatId, msgId, `🗑 <b>${name}</b> deleted!`, backBtn());
      }
    }

    if (data === 'noop') return;
    return;
  }

  // ── TEXT MESSAGE ──────────────────────────────
  if (update.message) {
    const { chat, text } = update.message;
    const chatId = chat.id;
    const session = sessions[chatId];

    if (session && text !== '/start') {
      if (text === '/cancel') {
        delete sessions[chatId];
        return api('sendMessage', {
          chat_id: chatId,
          text: '❌ Cancelled.',
          reply_markup: { inline_keyboard: [[{ text: '🔙 HOME', callback_data: 'home' }]] }
        });
      }
      return handleAddStep(chatId, text, session.msgId);
    }

    if (text === '/start') {
      const isOwner = chatId.toString() === OWNER_ID;
      return api('sendMessage', {
        chat_id: chatId,
        text: homeText(isOwner),
        parse_mode: 'HTML',
        reply_markup: mainMenu(isOwner)
      });
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