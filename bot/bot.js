// ╔══════════════════════════════════════════════╗
// ║  NEBULA USER MANAGER BOT v3.0              ║
// ║  AUTHOR: Abdullah Al Mamun (@A2MBD3)       ║
// ║  CREATOR-BASED + BROADCAST SYSTEM          ║
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
// SESSIONS
// ═══════════════════════════════════════════════
const sessions = {}; // add user sessions
const broadcastSessions = {}; // broadcast sessions

// ═══════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════
app.get('/', (req, res) => res.send('⬡ NEBULA Bot v3.0 | @A2MBD3'));

const ghHeaders = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'NebulaBot/3.0'
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

async function tg(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function editMsg(chatId, msgId, text, markup) {
  return tg('editMessageText', { chat_id: chatId, message_id: msgId, text, parse_mode: 'HTML', reply_markup: markup });
}

async function answerCb(cbId, text) {
  return tg('answerCallbackQuery', { callback_query_id: cbId, text, show_alert: false });
}

async function getUserByCreator(creatorUsername) {
  const { users } = await getUsers();
  return users.find(u => u.creator === creatorUsername);
}

// ═══════════════════════════════════════════════
// KEYBOARDS
// ═══════════════════════════════════════════════

function homeKB(isOwner, hasUser) {
  const b = [];
  if (hasUser) {
    b.push([{ text: '✏️ EDIT MY USER', callback_data: 'edit_my' }]);
  } else {
    b.push([{ text: '➕ CREATE USER', callback_data: 'add_start' }]);
  }
  if (isOwner) {
    b.push([{ text: '👥 ALL USERS', callback_data: 'users' }]);
    b.push([{ text: '📊 STATS', callback_data: 'stats' }]);
    b.push([{ text: '📢 BROADCAST', callback_data: 'broadcast' }]);
  }
  b.push([{ text: '🔄 REFRESH', callback_data: 'home' }]);
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

function ownerUserKB(user) {
  return {
    inline_keyboard: [
      [{ text: user.banned ? '✅ UNBAN' : '🚫 BAN', callback_data: `toggle_${user.id}` }],
      [{ text: '🗑 DELETE', callback_data: `del_${user.id}` }],
      [{ text: '🔙 USERS', callback_data: 'users' }],
    ]
  };
}

function editMyKB(userId) {
  return {
    inline_keyboard: [
      [{ text: '📛 EDIT NAME', callback_data: `edit_name_${userId}` }],
      [{ text: '🔑 EDIT PASSWORD', callback_data: `edit_pass_${userId}` }],
      [{ text: '📢 EDIT CHANNEL', callback_data: `edit_ch_${userId}` }],
      [{ text: '🔙 HOME', callback_data: 'home' }],
    ]
  };
}

function broadcastTypeKB() {
  return {
    inline_keyboard: [
      [{ text: '📝 TEXT', callback_data: 'bc_text' }],
      [{ text: '🖼 PHOTO', callback_data: 'bc_photo' }],
      [{ text: '🎥 VIDEO', callback_data: 'bc_video' }],
      [{ text: '📄 DOCUMENT', callback_data: 'bc_doc' }],
      [{ text: '🎵 AUDIO', callback_data: 'bc_audio' }],
      [{ text: '🔗 URL BUTTON', callback_data: 'bc_url' }],
      [{ text: '❌ CANCEL', callback_data: 'home' }],
    ]
  };
}

// ═══════════════════════════════════════════════
// TEXT GENERATORS
// ═══════════════════════════════════════════════

function homeText(isOwner, hasUser, user) {
  let t = '<b>⬡ NEBULA v3.0</b>\n\n';
  if (hasUser) {
    t += `👤 <b>${user.name}</b> (ID:${user.id})\n`;
    t += `🔑 Pass: ${user.password}\n`;
    t += `📢 Channel: ${user.tgChannel}\n`;
    t += `🚫 Status: ${user.banned ? 'Banned' : 'Active'}\n\n`;
    t += '<i>Use buttons below to edit.</i>';
  } else {
    t += 'Welcome! Create your user.\n\n<i>By @A2MBD3</i>';
  }
  return t;
}

function userText(u) {
  const bl = `javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${u.id};var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();`;
  return (
    `<b>👤 ${u.name}</b>\n\n` +
    `🆔 ID: ${u.id}\n` +
    `👑 Creator: @${u.creator || 'N/A'}\n` +
    `🔑 Pass: ${u.password}\n` +
    `📢 Channel: ${u.tgChannel}\n` +
    `🚫 Banned: ${u.banned ? 'Yes' : 'No'}\n\n` +
    `<b>📋 Bookmarklet:</b>\n<code>${bl}</code>`
  );
}

// ═══════════════════════════════════════════════
// ADD USER (WITH CREATOR)
// ═══════════════════════════════════════════════

function startAdd(chatId, msgId, creatorUsername) {
  sessions[chatId] = { step: 'name', msgId, data: { creator: creatorUsername } };
  editMsg(chatId, msgId, '➕ <b>CREATE USER</b>\n\nStep 1/3: Enter <b>Name</b>:', cancelBtn());
}

async function handleAddStep(chatId, text, msgId) {
  const s = sessions[chatId];
  if (!s) return;

  switch (s.step) {
    case 'name':
      s.data.name = text;
      s.step = 'password';
      await editMsg(chatId, msgId, `✅ Name: <b>${text}</b>\n\nStep 2/3: Enter <b>Password</b> (0=none):`, cancelBtn());
      break;
    case 'password':
      s.data.password = text;
      s.step = 'channel';
      await editMsg(chatId, msgId, `✅ Pass: <b>${text}</b>\n\nStep 3/3: Enter <b>Channel</b> (0=none):`, cancelBtn());
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
  
  const newUser = {
    id: maxId + 1,
    name: s.data.name,
    password: s.data.password,
    tgChannel: s.data.channel,
    creator: s.data.creator,
    banned: 0
  };

  users.push(newUser);
  await saveUsers(users, sha, `Add ${newUser.name} by @${s.data.creator}`);

  delete sessions[chatId];

  const bl = `javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${newUser.id};var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();`;

  await editMsg(chatId, msgId,
    '✅ <b>USER CREATED!</b>\n\n' +
    `🆔 ID: ${newUser.id}\n📛 ${newUser.name}\n\n` +
    '<b>Bookmarklet:</b>\n' +
    `<code>${bl}</code>`,
    { inline_keyboard: [[{ text: '🔙 HOME', callback_data: 'home' }], [{ text: '➕ ADD MORE', callback_data: 'add_start' }]] }
  );
}

// ═══════════════════════════════════════════════
// EDIT MY USER
// ═══════════════════════════════════════════════

function startEditField(chatId, msgId, userId, field) {
  sessions[chatId] = { step: 'edit', msgId, userId, field };
  const labels = { name: 'Name', password: 'Password', tgChannel: 'Channel' };
  editMsg(chatId, msgId, `✏️ Enter new <b>${labels[field]}</b>:`, cancelBtn());
}

async function handleEditStep(chatId, text, msgId) {
  const s = sessions[chatId];
  if (!s || s.step !== 'edit') return;

  const { users, sha } = await getUsers();
  const u = users.find(x => x.id === s.userId);
  if (!u) return editMsg(chatId, msgId, '❌ User not found!', backBtn());

  u[s.field] = text;
  await saveUsers(users, sha, `Edit ${s.field} for ${u.name}`);
  delete sessions[chatId];

  await editMsg(chatId, msgId, `✅ <b>${s.field}</b> updated to: <b>${text}</b>`, backBtn());
}

// ═══════════════════════════════════════════════
// BROADCAST SYSTEM
// ═══════════════════════════════════════════════

function startBroadcast(chatId, msgId) {
  broadcastSessions[chatId] = { step: 'type', msgId };
  editMsg(chatId, msgId, '📢 <b>BROADCAST</b>\n\nSelect content type:', broadcastTypeKB());
}

async function handleBroadcastType(chatId, msgId, type) {
  broadcastSessions[chatId] = { step: 'content', msgId, type };
  
  const prompts = {
    bc_text: 'Enter message text:',
    bc_photo: 'Send a photo with caption:',
    bc_video: 'Send a video with caption:',
    bc_doc: 'Send a document with caption:',
    bc_audio: 'Send an audio file with caption:',
    bc_url: 'Enter URL and button text:\nFormat: <code>https://link.com | Button Text</code>',
  };
  
  await editMsg(chatId, msgId, prompts[type], cancelBtn());
}

async function handleBroadcastSend(chatId, msgId, message) {
  const s = broadcastSessions[chatId];
  if (!s) return;

  const { users } = await getUsers();
  let sent = 0, failed = 0;
  const total = users.length;

  await editMsg(chatId, msgId, `📢 Sending to ${total} users...`);

  for (const user of users) {
    try {
      // Get user's chat ID (we need to store this when they interact)
      // For now, skip if no chat ID stored
      if (!user.chatId) continue;

      if (s.type === 'bc_text') {
        await tg('sendMessage', { chat_id: user.chatId, text: message, parse_mode: 'HTML' });
      } else if (s.type === 'bc_photo') {
        await tg('sendPhoto', { chat_id: user.chatId, photo: message.photo?.[0]?.file_id, caption: message.caption });
      } else if (s.type === 'bc_video') {
        await tg('sendVideo', { chat_id: user.chatId, video: message.video?.file_id, caption: message.caption });
      } else if (s.type === 'bc_doc') {
        await tg('sendDocument', { chat_id: user.chatId, document: message.document?.file_id, caption: message.caption });
      } else if (s.type === 'bc_url') {
        const [url, btnText] = message.split('|').map(s => s.trim());
        await tg('sendMessage', {
          chat_id: user.chatId,
          text: '🔗 Shared link:',
          reply_markup: { inline_keyboard: [[{ text: btnText || 'Open', url }]] }
        });
      }
      sent++;
    } catch (e) {
      failed++;
    }
  }

  delete broadcastSessions[chatId];
  await editMsg(chatId, msgId,
    `✅ <b>BROADCAST DONE!</b>\n\n` +
    `✅ Sent: ${sent}\n❌ Failed: ${failed}\n👥 Total: ${total}`,
    backBtn()
  );
}

// ═══════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════

async function handleUpdate(update) {
  // ── CALLBACK QUERY ───────────────────────────
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const msgId = cb.message.message_id;
    const data = cb.data;
    const isOwner = chatId.toString() === OWNER_ID;
    const username = cb.from.username || '';

    await answerCb(cb.id, '');

    // Home
    if (data === 'home') {
      const user = await getUserByCreator(username);
      return editMsg(chatId, msgId, homeText(isOwner, !!user, user), homeKB(isOwner, !!user));
    }

    // Users list
    if (data === 'users') {
      const { users } = await getUsers();
      const t = users.map(u => `${u.banned ? '🚫' : '✅'} <b>${u.name}</b> (${u.id})`).join('\n');
      return editMsg(chatId, msgId, `<b>👥 ALL USERS (${users.length})</b>\n\n${t}`, userListKB(users));
    }

    if (data.startsWith('users_')) {
      const page = parseInt(data.split('_')[1]);
      const { users } = await getUsers();
      const perPage = 8;
      const slice = users.slice(page * perPage, (page + 1) * perPage);
      const t = slice.map(u => `${u.banned ? '🚫' : '✅'} <b>${u.name}</b> (${u.id})`).join('\n');
      return editMsg(chatId, msgId, `<b>👥 USERS</b>\n\n${t}`, userListKB(users, page));
    }

    // View user (owner)
    if (data.startsWith('view_')) {
      const id = parseInt(data.split('_')[1]);
      const { users } = await getUsers();
      const u = users.find(x => x.id === id);
      if (!u) return;
      return editMsg(chatId, msgId, userText(u), ownerUserKB(u));
    }

    // Toggle ban
    if (data.startsWith('toggle_')) {
      const id = parseInt(data.split('_')[1]);
      const { users, sha } = await getUsers();
      const u = users.find(x => x.id === id);
      if (u) {
        u.banned = u.banned ? 0 : 1;
        await saveUsers(users, sha, `${u.banned ? 'Ban' : 'Unban'} ${u.name}`);
        return editMsg(chatId, msgId, userText(u), ownerUserKB(u));
      }
    }

    // Delete
    if (data.startsWith('del_')) {
      const id = parseInt(data.split('_')[1]);
      const { users, sha } = await getUsers();
      const idx = users.findIndex(x => x.id === id);
      if (idx > -1) {
        const name = users[idx].name;
        users.splice(idx, 1);
        await saveUsers(users, sha, `Delete ${name}`);
        return editMsg(chatId, msgId, `🗑 <b>${name}</b> deleted!`, backBtn());
      }
    }

    // Add user
    if (data === 'add_start') {
      return startAdd(chatId, msgId, username);
    }

    // Edit my user
    if (data === 'edit_my') {
      const user = await getUserByCreator(username);
      if (!user) return editMsg(chatId, msgId, '❌ No user found!', backBtn());
      return editMsg(chatId, msgId, userText(user), editMyKB(user.id));
    }

    // Edit specific field
    if (data.startsWith('edit_name_')) {
      return startEditField(chatId, msgId, parseInt(data.split('_')[2]), 'name');
    }
    if (data.startsWith('edit_pass_')) {
      return startEditField(chatId, msgId, parseInt(data.split('_')[2]), 'password');
    }
    if (data.startsWith('edit_ch_')) {
      return startEditField(chatId, msgId, parseInt(data.split('_')[2]), 'tgChannel');
    }

    // Stats
    if (data === 'stats') {
      const { users } = await getUsers();
      return editMsg(chatId, msgId,
        '<b>📊 STATS</b>\n\n' +
        `👥 Total: ${users.length}\n` +
        `✅ Active: ${users.filter(u => !u.banned).length}\n` +
        `🚫 Banned: ${users.filter(u => u.banned).length}`,
        backBtn()
      );
    }

    // Broadcast
    if (data === 'broadcast') {
      return startBroadcast(chatId, msgId);
    }
    if (data.startsWith('bc_')) {
      return handleBroadcastType(chatId, msgId, data);
    }

    if (data === 'noop') return;
    return;
  }

  // ── MESSAGE ──────────────────────────────────
  if (update.message) {
    const { chat, text, from } = update.message;
    const chatId = chat.id;
    const username = from.username || '';
    const isOwner = chatId.toString() === OWNER_ID;

    // Store chat ID for broadcast
    const { users, sha } = await getUsers();
    const user = users.find(u => u.creator === username);
    if (user && !user.chatId) {
      user.chatId = chatId;
      await saveUsers(users, sha, `Store chatId for ${user.name}`);
    }

    // Session: Add user
    if (sessions[chatId]?.step && sessions[chatId].step !== 'edit') {
      if (text === '/cancel') {
        delete sessions[chatId];
        return tg('sendMessage', { chat_id: chatId, text: '❌ Cancelled.', reply_markup: backBtn() });
      }
      return handleAddStep(chatId, text, sessions[chatId].msgId);
    }

    // Session: Edit field
    if (sessions[chatId]?.step === 'edit') {
      if (text === '/cancel') {
        delete sessions[chatId];
        return tg('sendMessage', { chat_id: chatId, text: '❌ Cancelled.', reply_markup: backBtn() });
      }
      return handleEditStep(chatId, text, sessions[chatId].msgId);
    }

    // Session: Broadcast content
    if (broadcastSessions[chatId]?.step === 'content') {
      if (text === '/cancel') {
        delete broadcastSessions[chatId];
        return tg('sendMessage', { chat_id: chatId, text: '❌ Cancelled.', reply_markup: backBtn() });
      }
      // Check if media message
      if (update.message.photo || update.message.video || update.message.document || update.message.audio) {
        return handleBroadcastSend(chatId, broadcastSessions[chatId].msgId, update.message);
      }
      return handleBroadcastSend(chatId, broadcastSessions[chatId].msgId, text);
    }

    // /start
    if (text === '/start') {
      const hasUser = await getUserByCreator(username);
      return tg('sendMessage', {
        chat_id: chatId,
        text: homeText(isOwner, !!hasUser, hasUser),
        parse_mode: 'HTML',
        reply_markup: homeKB(isOwner, !!hasUser)
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

app.listen(PORT, () => {
  console.log(`⬡ NEBULA Bot v3.0 | Port: ${PORT} | @A2MBD3`);
  poll();
});
