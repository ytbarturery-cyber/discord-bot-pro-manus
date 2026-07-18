const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Bannir un membre')
      .addUserOption(opt => opt.setName('cible').setDescription('Membre à bannir').setRequired(true))
      .addStringOption(opt => opt.setName('raison').setDescription('Raison du bannissement'))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
      const user = interaction.options.getUser('cible');
      const reason = interaction.options.getString('raison') || 'Aucune raison';
      await interaction.guild.members.ban(user, { reason });
      await interaction.reply(`✅ **${user.tag}** a été banni. Raison : ${reason}`);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('clear')
      .setDescription('Supprimer des messages')
      .addIntegerOption(opt => opt.setName('nombre').setDescription('Nombre de messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
      const amount = interaction.options.getInteger('nombre');
      const deleted = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `✅ ${deleted.size} messages supprimés.`, ephemeral: true });
    }
  }
];
