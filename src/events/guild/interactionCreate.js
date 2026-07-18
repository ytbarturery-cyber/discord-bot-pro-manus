const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client, db, saveDB) {
    if (interaction.isButton()) {
      // 1. Tickets
      if (interaction.customId === 'open_ticket') {
        const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
          ]
        });
        return interaction.reply({ content: `✅ Ticket ouvert : ${channel}`, ephemeral: true });
      }
      
      // 2. Rôles par boutons
      if (interaction.customId.startsWith('role_')) {
        const roleId = interaction.customId.split('_')[1];
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) return interaction.reply({ content: '❌ Rôle introuvable.', ephemeral: true });
        
        if (interaction.member.roles.cache.has(roleId)) {
          await interaction.member.roles.remove(roleId);
          await interaction.reply({ content: `❌ Rôle **${role.name}** retiré !`, ephemeral: true });
        } else {
          await interaction.member.roles.add(roleId);
          await interaction.reply({ content: `✅ Rôle **${role.name}** ajouté !`, ephemeral: true });
        }
      }
    }
  }
};
