const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configurer les modules du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub => sub.setName('welcome').setDescription('Configurer le salon de bienvenue').addChannelOption(opt => opt.setName('salon').setDescription('Salon de bienvenue').setRequired(true)))
    .addSubcommand(sub => sub.setName('goodbye').setDescription('Configurer le salon de départ').addChannelOption(opt => opt.setName('salon').setDescription('Salon de départ').setRequired(true)))
    .addSubcommand(sub => sub.setName('logs').setDescription('Configurer le salon de logs').addChannelOption(opt => opt.setName('salon').setDescription('Salon de logs').setRequired(true)))
    .addSubcommand(sub => sub.setName('automod').setDescription('Activer/Désactiver l\'AutoMod').addBooleanOption(opt => opt.setName('etat').setDescription('Activer ?').setRequired(true))),
  async execute(interaction, client, db, saveDB) {
    const guildId = interaction.guild.id;
    if (!db.guilds[guildId]) db.guilds[guildId] = {};
    
    const sub = interaction.options.getSubcommand();
    
    if (sub === 'welcome') {
      const channel = interaction.options.getChannel('salon');
      db.guilds[guildId].welcomeChannel = channel.id;
      await interaction.reply(`✅ Salon de bienvenue défini sur ${channel}`);
    } else if (sub === 'goodbye') {
      const channel = interaction.options.getChannel('salon');
      db.guilds[guildId].goodbyeChannel = channel.id;
      await interaction.reply(`✅ Salon de départ défini sur ${channel}`);
    } else if (sub === 'logs') {
      const channel = interaction.options.getChannel('salon');
      db.guilds[guildId].logsChannel = channel.id;
      await interaction.reply(`✅ Salon de logs défini sur ${channel}`);
    } else if (sub === 'automod') {
      const state = interaction.options.getBoolean('etat');
      db.guilds[guildId].automod = { enabled: state, antiLinks: state, antiBadWords: state };
      await interaction.reply(`✅ AutoMod ${state ? 'activé' : 'désactivé'}`);
    }
    
    saveDB();
  }
};
