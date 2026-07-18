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
      if (!db.users[key]) db.users[key] = { xp: 0, level: 1, balance: 100 };
      
      db.users[key].balance += 50;
      saveDB();
      
      await interaction.reply(`🎁 Vous avez reçu **50 💰** ! Nouveau solde : ${db.users[key].balance} 💰`);
    }
  }
];
