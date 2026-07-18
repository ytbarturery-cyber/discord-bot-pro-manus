const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-tickets')
    .setDescription('Installer le système de tickets')
    .addChannelOption(opt => opt.setName('salon').setDescription('Salon où envoyer le message de ticket').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('salon');
    
    const embed = new EmbedBuilder()
      .setTitle('Support')
      .setDescription('Cliquez sur le bouton ci-dessous pour ouvrir un ticket.')
      .setColor('#0099ff');
      
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('open_ticket').setLabel('Ouvrir un ticket').setStyle(ButtonStyle.Primary).setEmoji('🎫')
    );
    
    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Système de tickets installé !', ephemeral: true });
  }
};
