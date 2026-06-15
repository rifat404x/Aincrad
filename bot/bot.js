// ╔══════════════════════════════════════════════╗
// ║  NEBULA USER MANAGER BOT                   ║
// ║  AUTHOR: Abdullah Al Mamun (@A2MBD3)       ║
// ║  VERSION: 1.0.0 - FULL BOT                 ║
// ╚══════════════════════════════════════════════╝

const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════
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
  if (!res.ok) throw new Error('GitHub fetch failed');
  const data = await res.json();
  return {
    users: JSON.parse(Buffer.from(data.content, 'base64').toString()).users || [],
    sha: data.sha
  };
}

async function saveUsers(users, sha, msg) {
  const body = {
    message: `🤖 ${msg} [via NEBULA Bot]`,
    content: Buffer.from(JSON.stringify({ users }, null, 2)).toString('base64'),
    sha: sha
  };
  const res = await fetch(GH_API, {
    method: 'PUT',
    headers: { ...ghHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.ok;
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
  } catch (e) {}
}

// ═══════════════════════════════════════════════
// COMMANDS
// ═══════════════════════════════════════════════
async function handleUpdate(update) {
  if (!update.message) return;
  const { chat, text, from } = update.message;
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
          '<b>📝 Example:</b>\n' +
          '<code>/add 5,New User,t.me/test,0,0</code>\n\n' +
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
        list += `<i>Total: ${users.length} users</i>`;
        sendMessage(chatId, list);
        break;
      }
      
      case '/find': {
        const id = parseInt(args[0]);
        if (!id) return sendMessage(chatId, '❌ Usage: <code>/find [id]</code>');
        const { users } = await getUsers();
        const u = users.find(x => x.id === id);
        if (u) {
          sendMessage(chatId,
            `<b>👤 USER #${u.id}</b>\n\n` +
            `📛 Name: ${u.name}\n` +
            `📢 Channel: ${u.tgChannel}\n` +
            `🔑 Password: ${u.password}\n` +
            `🚫 Banned: ${u.banned ? 'Yes' : 'No'}`
          );
        } else {
          sendMessage(chatId, '❌ User not found!');
        }
        break;
      }
      
      case '/active': {
        const active = (await getUsers()).users.filter(u => !u.banned);
        let txt = `<b>✅ ACTIVE USERS (${active.length})</b>\n\n`;
        active.forEach(u => txt += `• <b>ID:${u.id}</b> ${u.name}\n`);
        sendMessage(chatId, txt || 'No active users');
        break;
      }
      
      case '/banned': {
        const banned = (await getUsers()).users.filter(u => u.banned);
        let txt = `<b>🚫 BANNED USERS (${banned.length})</b>\n\n`;
        banned.forEach(u => txt += `• <b>ID:${u.id}</b> ${u.name}\n`);
        sendMessage(chatId, txt || '✅ No banned users!');
        break;
      }
      
      case '/stats': {
        const all = (await getUsers()).users;
        const total = all.length;
        const active = all.filter(u => !u.banned).length;
        const banned = all.filter(u => u.banned).length;
        const withPass = all.filter(u => u.password !== '0').length;
        const withCh = all.filter(u => u.tgChannel !== '0').length;
        sendMessage(chatId,
          '<b>📊 NEBULA STATISTICS</b>\n\n' +
          `👥 Total Users: <b>${total}</b>\n` +
          `✅ Active: <b>${active}</b>\n` +
          `🚫 Banned: <b>${banned}</b>\n` +
          `🔑 With Password: <b>${withPass}</b>\n` +
          `📢 With Channel: <b>${withCh}</b>\n\n` +
          '<i>By @A2MBD3</i>'
        );
        break;
      }
      
      case '/add': {
        if (args.length < 5) return sendMessage(chatId, '❌ Format: <code>/add id,name,channel,password,banned</code>');
        const { users, sha } = await getUsers();
        const newUser = {
          id: parseInt(args[0]),
          name: args[1],
          tgChannel: args[2],
          password: args[3],
          banned: parseInt(args[4])
        };
        if (users.find(u => u.id === newUser.id)) {
          return sendMessage(chatId, `❌ ID ${newUser.id} already exists! Use /edit`);
        }
        users.push(newUser);
        const ok = await saveUsers(users, sha, `Add user ${newUser.name} (ID:${newUser.id})`);
        sendMessage(chatId, ok ? `✅ <b>${newUser.name}</b> added!` : '❌ Failed!');
        break;
      }
      
      case '/edit': {
        if (args.length < 5) return sendMessage(chatId, '❌ Format: <code>/edit id,name,channel,password,banned</code>');
        const { users, sha } = await getUsers();
        const idx = users.findIndex(u => u.id === parseInt(args[0]));
        if (idx === -1) return sendMessage(chatId, '❌ User not found!');
        const oldName = users[idx].name;
        users[idx] = {
          id: parseInt(args[0]),
          name: args[1],
          tgChannel: args[2],
          password: args[3],
          banned: parseInt(args[4])
        };
        const ok = await saveUsers(users, sha, `Edit ${oldName} → ${args[1]} (ID:${args[0]})`);
        sendMessage(chatId, ok ? `✅ Updated: <b>${args[1]}</b>` : '❌ Failed!');
        break;
      }
      
      case '/ban': {
        const id = parseInt(args[0]);
        if (!id) return sendMessage(chatId, '❌ Usage: <code>/ban [id]</code>');
        const { users, sha } = await getUsers();
        const u = users.find(x => x.id === id);
        if (!u) return sendMessage(chatId, '❌ User not found!');
        u.banned = 1;
        const ok = await saveUsers(users, sha, `Ban ${u.name} (ID:${id})`);
        sendMessage(chatId, ok ? `🚫 <b>${u.name}</b> banned!` : '❌ Failed!');
        break;
      }
      
      case '/unban': {
        const id = parseInt(args[0]);
        if (!id) return sendMessage(chatId, '❌ Usage: <code>/unban [id]</code>');
        const { users, sha } = await getUsers();
        const u = users.find(x => x.id === id);
        if (!u) return sendMessage(chatId, '❌ User not found!');
        u.banned = 0;
        const ok = await saveUsers(users, sha, `Unban ${u.name} (ID:${id})`);
        sendMessage(chatId, ok ? `✅ <b>${u.name}</b> unbanned!` : '❌ Failed!');
        break;
      }
      
      case '/delete': {
        const id = parseInt(args[0]);
        if (!id) return sendMessage(chatId, '❌ Usage: <code>/delete [id]</code>');
        const { users, sha } = await getUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return sendMessage(chatId, '❌ User not found!');
        const name = users[idx].name;
        users.splice(idx, 1);
        const ok = await saveUsers(users, sha, `Delete ${name} (ID:${id})`);
        sendMessage(chatId, ok ? `🗑 <b>${name}</b> deleted!` : '❌ Failed!');
        break;
      }
      
      default:
        sendMessage(chatId, '❌ Unknown command. Use /start');
    }
  } catch (e) {
    sendMessage(chatId, '❌ Error! Check logs.');
    console.error(e);
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
  console.log(`⬡ NEBULA Bot v1.0 | Port: ${PORT} | @A2MBD3`);
  poll();
});