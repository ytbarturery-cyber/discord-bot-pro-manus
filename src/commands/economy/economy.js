const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('profile')
      .setDescription('Voir votre profil (XP, Niveau, Argent)')
      .addUserOption(opt => opt.setName('utilisateur').setDescription('Voir le profil de quelqu\'un d\'autre')),
    async execute(interaction, client, db) {
      const target = interaction.options.getUser('utilisateur') || interaction.user;
      const key = `${target.id}-${interaction.guild.id}`;
      const data = db.users[key] || { xp: 0, level: 1, balance: 100 };
      
      const embed = new EmbedBuilder()
        .setTitle(`Profil de ${target.username}`)
        .setColor('#0099ff')
        .addFields(
          { name: 'Niveau', value: `${data.level}`, inline: true },
          { name: 'XP', value: `${data.xp}/100`, inline: true },
          { name: 'Argent', value: `${data.balance} 💰`, inline: true }
        )
        .setThumbnail(target.displayAvatarURL());
        
      await interaction.reply({ embeds: [embed] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('daily')
      .setDescription('Récupérer votre récompense quotidienne'),
    async execute(interaction, client, db, saveDB) {
      const key = `${interaction.user.id}-${interaction.guild.id}`;
      if (!db.users[key]) db.users[key] = { xp: 0, level: 1, balance: 100, lastDaily: 0 };
      
      const now = Date.now();
      const cooldown = 24 * 60 * 60 * 1000; // 24 heures
      
      if (now - db.users[key].lastDaily < cooldown) {
        const remaining = cooldown - (now - db.users[key].lastDaily);
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        return interaction.reply({ content: `❌ Vous avez déjà récupéré votre récompense ! Revenez dans **${hours}h ${minutes}m**.`, ephemeral: true });
      }
      
      db.users[key].balance += 50;
      db.users[key].lastDaily = now;
      saveDB();
      
      await interaction.reply(`🎁 Vous avez reçu **50 💰** ! Nouveau solde : ${db.users[key].balance} 💰`);
    }
  }
];
