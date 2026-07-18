const antiNuke = require('../../modules/antinuke/antiNuke');
const { AuditLogEvent } = require('discord.js');

module.exports = [
  {
    name: 'channelDelete',
    async execute(channel, client, db) {
      const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete });
      const log = auditLogs.entries.first();
      if (log) await antiNuke.check(channel.guild, log.executor, 'Suppression de salon', db);
    }
  },
  {
    name: 'roleDelete',
    async execute(role, client, db) {
      const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete });
      const log = auditLogs.entries.first();
      if (log) await antiNuke.check(role.guild, log.executor, 'Suppression de rôle', db);
    }
  }
];
