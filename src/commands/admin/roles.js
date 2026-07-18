const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('add-roles-auto')
      .setDescription('Définir les rôles donnés automatiquement à l\'arrivée')
      .addStringOption(opt => opt.setName('roles').setDescription('IDs des rôles séparés par un espace').setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client, db, saveDB) {
      const rolesStr = interaction.options.getString('roles');
      // Extraire les IDs des mentions <@&ID>
      const rolesArray = rolesStr.match(/\d+/g);
      
      if (!rolesArray) return interaction.reply({ content: '❌ Veuillez mentionner des rôles valides.', ephemeral: true });

      const guildId = interaction.guild.id;
      if (!db.guilds[guildId]) db.guilds[guildId] = {};
      db.guilds[guildId].autoRoles = rolesArray;
      saveDB();
      
      await interaction.reply(`✅ Les rôles suivants seront donnés automatiquement : ${rolesArray.map(id => `<@&${id}>`).join(', ')}`);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('config-roles')
      .setDescription('Créer un message de rôles par boutons')
      .addStringOption(opt => opt.setName('roles').setDescription('IDs des rôles séparés par un espace').setRequired(true))
      .addStringOption(opt => opt.setName('message').setDescription('Message à afficher').setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
      const rolesStr = interaction.options.getString('roles');
      const messageText = interaction.options.getString('message');
      // Extraire les IDs des mentions <@&ID>
      const rolesArray = rolesStr.match(/\d+/g)?.slice(0, 5);
      
      if (!rolesArray) return interaction.reply({ content: '❌ Veuillez mentionner des rôles valides.', ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle('Sélection de rôles')
        .setDescription(messageText)
        .setColor('#00ff00');
        
      const row = new ActionRowBuilder();
      
      rolesArray.forEach(roleId => {
        const role = interaction.guild.roles.cache.get(roleId);
        if (role) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`role_${roleId}`)
              .setLabel(role.name)
              .setStyle(ButtonStyle.Secondary)
          );
        }
      });
      
      await interaction.channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: '✅ Message de rôles envoyé !', ephemeral: true });
    }
  }
];
