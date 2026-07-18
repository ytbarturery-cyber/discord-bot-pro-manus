const { EmbedBuilder } = require('discord.js');

const autoMod = {
  async handleMessage(message, db, saveDB) {
    if (!message.guild || message.author.bot) return;
    
    const config = db.guilds[message.guild.id]?.automod || { enabled: false };
    if (!config.enabled) return;

    // 1. Anti-Liens
    if (config.antiLinks && /(https?:\/\/[^\s]+)/g.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send(`${message.author}, les liens sont interdits ici !`).then(m => setTimeout(() => m.delete(), 5000));
    }

    // 2. Anti-Spam (Simple)
    // À implémenter avec un système de cache
    
    // 3. Anti-Insultes
    const badWords = ['connard', 'salope', 'fdp', 'pute']; // Liste extensible
    if (config.antiBadWords && badWords.some(word => message.content.toLowerCase().includes(word))) {
      await message.delete().catch(() => {});
      return message.channel.send(`${message.author}, surveille ton langage !`).then(m => setTimeout(() => m.delete(), 5000));
    }
  }
};

module.exports = autoMod;
