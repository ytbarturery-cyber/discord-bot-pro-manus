const { EmbedBuilder } = require('discord.js');

module.exports = [
  {
    name: 'guildMemberAdd',
    async execute(member, client, db) {
      const config = db.guilds[member.guild.id];
      if (!config || !config.welcomeChannel) return;
      
      const channel = member.guild.channels.cache.get(config.welcomeChannel);
      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle('Bienvenue !')
          .setDescription(`Bienvenue ${member} sur le serveur **${member.guild.name}** !`)
          .setThumbnail(member.user.displayAvatarURL())
          .setColor('#00ff00')
          .setTimestamp();
        await channel.send({ embeds: [embed] });
      }

      // Autoroles
      if (config.autoRoles && Array.isArray(config.autoRoles)) {
        for (const roleId of config.autoRoles) {
          await member.roles.add(roleId).catch(() => {});
        }
      }
    }
  },
  {
    name: 'guildMemberRemove',
    async execute(member, client, db) {
      const config = db.guilds[member.guild.id];
      if (!config || !config.goodbyeChannel) return;
      
      const channel = member.guild.channels.cache.get(config.goodbyeChannel);
      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle('Au revoir !')
          .setDescription(`${member.user.tag} nous a quittés.`)
          .setThumbnail(member.user.displayAvatarURL())
          .setColor('#ff0000')
          .setTimestamp();
        await channel.send({ embeds: [embed] });
      }
    }
  }
];
