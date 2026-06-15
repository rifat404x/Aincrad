// ╔══════════════════════════════════════════════╗
// ║  NEBULA USER MANAGER BOT                   ║
// ║  AUTHOR: Abdullah Al Mamun (@A2MBD3)       ║
// ╚══════════════════════════════════════════════╝

const express = require('express');
const fetch = require('node-fetch');
const { Buffer } = require('buffer');

const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim());
const REPO = 'A2MBD3/Aincrad';
const FILE_PATH = 'asset/users.json';
const API = `https://api.telegram.org/bot${TOKEN}`;
const GH_API = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

// ═══════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════
app.get('/', (req, res) => {
  res.send('⬡ NEBULA Bot Active | @A2MBD3');
});

// ═══════════════════════════════════════════════
// GITHUB API
// ═══════════════════════════════════════════════
const ghHeaders = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'NebulaBot/1.0'
};

async function getUsers() {
  const res = await fetch(GH_API + '?t=' + Date.now(), { headers: ghHeaders });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub Error ${res.status}: ${err}`);
  }
  const data = await res.json();
  const content = data.content;
  const decoded = Buffer.from(content, 'base64').toString('utf8');
  const json = JSON.parse(decoded);
  return {
    users: json.users || [],
    sha: data.sha
  };
}

async function saveUsers(users, sha, msg) {
  const content = JSON.stringify({ users }, null, 2);
  const body = {
    message: `🤖 ${msg} [via NEBULA Bot]`,
    content: Buffer.from(content).toString('base64'),
    sha: sha
  };
  const res = await fetch(GH_API, {
    method: 'PUT',
    headers: { ...ghHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub Write Error ${res.status}: ${err}`);
  }
  return true;
}

// ═══════════════════════════════════════════════
// TELEGRAM API
// ═══════════════════════════════════════════════
async function sendMessage(chatId, text) {
  try {
    await fetch(`${API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
  } catch (e) {
    console.error('Send Error:', e.message);
  }
}

async function replyError(chatId, cmd, error) {
  console.error(`Command ${cmd} Error:`, error.message);
  sendMessage(chatId, `❌ <b>Error!</b>\n\n<code>${error.message}</code>`);
}

// ═══════════════════════════════════════════════
// COMMANDS
// ═══════════════════════════════════════════════
async function handleUpdate(update) {
  if (!update.message) return;
  const { chat, text } = update.message;
  const chatId = chat.id;
  const parts = text.split(' ');
  const cmd = parts[0].toLowerCase();
  const argsStr = parts.slice(1).join(' ');
  const args = argsStr ? argsStr.split(',').map(a => a.trim()) : [];
  
  // Auth check
  if (!ADMIN_IDS.includes(chatId.toString())) {
    return sendMessage(chatId, '⛔ <b>Access Denied</b>\n\nContact: @A2MBD3');
  }
  
  try {
    switch (cmd) {
      case '/start':
        sendMessage(chatId,
          '<b>⬡ NEBULA USER MANAGER v1.0</b>\n\n' +
          '<b>📋 Commands:</b>\n\n' +
          '/list - All users\n' +
          '/find [id] - Find user\n' +
          '/active - Active users\n' +
          '/banned - Banned list\n' +
          '/stats - Statistics\n\n' +
          '<b>✏️ Edit Commands:</b>\n\n' +
          '/add [id],[name],[channel],[pass],[banned]\n' +
          '/edit [id],[name],[channel],[pass],[banned]\n' +
          '/ban [id]\n' +
          '/unban [id]\n' +
          '/delete [id]\n\n' +
          '<i>By Abdullah Al Mamun | @A2MBD3</i>'
        );
        break;
        
      case '/list': {
        const { users } = await getUsers();
        let list = '<b>👥 ALL USERS</b>\n\n';
        users.forEach(u => {
          list += `${u.banned ? '🚫' : '✅'} <b>ID:${u.id}</b> ${u.name}\n`;
          list += `   🔑:${u.password === '0' ? 'No' : 'Yes'} | 📢:${u.tgChannel === '0' ? 'None' : u.tgChannel}\n\n`;
        });
        list += `<i>Total: ${users.length}</i>`;
        sendMessage(chatId, list);
        break;
      }
      
      case '/stats': {
        const all = (await getUsers()).users;
        sendMessage(chatId,
          '<b>📊 STATS</b>\n\n' +
          `👥 Total: ${all.length}\n` +
          `✅ Active: ${all.filter(u => !u.banned).length}\n` +
          `🚫 Banned: ${all.filter(u => u.banned).length}`
        );
        break;
      }
      
      case '/add': {
        if (args.length < 5) return sendMessage(chatId, '❌ Format: /add id,name,channel,password,banned');
        const { users, sha } = await getUsers();
        const newUser = {
          id: parseInt(args[0]),
          name: args[1],
          tgChannel: args[2],
          password: args[3],
          banned: parseInt(args[4])
        };
        if (users.find(u => u.id === newUser.id)) {
          return sendMessage(chatId, `❌ ID ${newUser.id} exists! Use /edit`);
        }
        users.push(newUser);
        await saveUsers(users, sha, `Add ${newUser.name}`);
        sendMessage(chatId, `✅ Added: <b>${newUser.name}</b>`);
        break;
      }
      
      case '/edit': {
        if (args.length < 5) return sendMessage(chatId, '❌ Format: /edit id,name,channel,password,banned');
        const { users, sha } = await getUsers();
        const idx = users.findIndex(u => u.id === parseInt(args[0]));
        if (idx === -1) return sendMessage(chatId, '❌ User not found!');
        users[idx] = {
          id: parseInt(args[0]),
          name: args[1],
          tgChannel: args[2],
          password: args[3],
          banned: parseInt(args[4])
        };
        await saveUsers(users, sha, `Edit ${args[1]}`);
        sendMessage(chatId, `✅ Updated: <b>${args[1]}</b>`);
        break;
      }
      
      case '/ban': {
        const id = parseInt(args[0]);
        if (!id) return sendMessage(chatId, '❌ Usage: /ban [id]');
        const { users, sha } = await getUsers();
        const u = users.find(x => x.id === id);
        if (!u) return sendMessage(chatId, '❌ User not found!');
        u.banned = 1;
        await saveUsers(users, sha, `Ban ${u.name}`);
        sendMessage(chatId, `🚫 Banned: <b>${u.name}</b>`);
        break;
      }
      
      case '/unban': {
        const id = parseInt(args[0]);
        if (!id) return sendMessage(chatId, '❌ Usage: /unban [id]');
        const { users, sha } = await getUsers();
        const u = users.find(x => x.id === id);
        if (!u) return sendMessage(chatId, '❌ User not found!');
        u.banned = 0;
        await saveUsers(users, sha, `Unban ${u.name}`);
        sendMessage(chatId, `✅ Unbanned: <b>${u.name}</b>`);
        break;
      }
      
      case '/delete': {
        const id = parseInt(args[0]);
        if (!id) return sendMessage(chatId, '❌ Usage: /delete [id]');
        const { users, sha } = await getUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return sendMessage(chatId, '❌ User not found!');
        const name = users[idx].name;
        users.splice(idx, 1);
        await saveUsers(users, sha, `Delete ${name}`);
        sendMessage(chatId, `🗑 Deleted: <b>${name}</b>`);
        break;
      }
      
      default:
        sendMessage(chatId, '❌ Unknown command. Use /start');
    }
  } catch (e) {
    replyError(chatId, cmd, e);
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
  } catch (e) {
    console.error('Poll Error:', e.message);
  }
  poll();
}

// ═══════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`⬡ NEBULA Bot v1.0 | Port: ${PORT} | @A2MBD3`);
  console.log('✅ GitHub Token:', GITHUB_TOKEN ? 'SET' : 'MISSING!');
  console.log('✅ Bot Token:', TOKEN ? 'SET' : 'MISSING!');
  console.log('✅ Admin IDs:', ADMIN_IDS.join(','));
  poll();
});