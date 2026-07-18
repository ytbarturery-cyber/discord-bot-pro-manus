const autoMod = require('../../modules/automod/autoMod');

module.exports = {
  name: 'messageCreate',
  async execute(message, client, db, saveDB) {
    if (message.author.bot || !message.guild) return;

    // 1. AutoMod
    await autoMod.handleMessage(message, db, saveDB);

    // 2. Système d'XP
    const key = `${message.author.id}-${message.guild.id}`;
    if (!db.users[key]) db.users[key] = { xp: 0, level: 1, balance: 100 };
    
    db.users[key].xp += Math.floor(Math.random() * 10) + 5;
    if (db.users[key].xp >= 100) {
      db.users[key].xp = 0;
      db.users[key].level += 1;
      // message.channel.send(`Bravo ${message.author}, tu es niveau ${db.users[key].level} !`);
    }
    saveDB();
  }
};
