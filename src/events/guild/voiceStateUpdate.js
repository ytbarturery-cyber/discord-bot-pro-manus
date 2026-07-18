const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client, db, saveDB) {
    const { member, guild } = newState;
    const config = db.guilds[guild.id]?.voiceMaster;
    if (!config) return;

    // 1. Création d'un salon
    if (newState.channelId === config.channelId) {
      const channel = await guild.channels.create({
        name: `Vocal de ${member.user.username}`,
        type: ChannelType.GuildVoice,
        parent: newState.channel.parentId,
        permissionOverwrites: [
          { id: member.id, allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers] }
        ]
      });
      await member.voice.setChannel(channel);
      if (!db.guilds[guild.id].tempChannels) db.guilds[guild.id].tempChannels = [];
      db.guilds[guild.id].tempChannels.push(channel.id);
      saveDB();
    }

    // 2. Suppression d'un salon vide
    if (oldState.channelId && db.guilds[guild.id].tempChannels?.includes(oldState.channelId)) {
      const channel = oldState.channel;
      if (channel && channel.members.size === 0) {
        await channel.delete().catch(() => {});
        db.guilds[guild.id].tempChannels = db.guilds[guild.id].tempChannels.filter(id => id !== oldState.channelId);
        saveDB();
      }
    }
  }
};
