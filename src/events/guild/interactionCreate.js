const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client, db, saveDB) {
    if (interaction.isButton()) {
      if (interaction.customId === 'open_ticket') {
        const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
          ]
        });
        await interaction.reply({ content: `✅ Ticket ouvert : ${channel}`, ephemeral: true });
      }
    }
  }
};
