const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-webhook')
    .setDescription('Créer et envoyer un message via un Webhook')
    .addStringOption(opt => opt.setName('nom').setDescription('Nom du Webhook').setRequired(true))
    .addStringOption(opt => opt.setName('message').setDescription('Message à envoyer').setRequired(true))
    .addStringOption(opt => opt.setName('image').setDescription('URL de l\'image de profil du Webhook'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks),
  async execute(interaction) {
    const name = interaction.options.getString('nom');
    const message = interaction.options.getString('message');
    const avatar = interaction.options.getString('image');
    
    try {
      const webhook = await interaction.channel.createWebhook({
        name: name,
        avatar: avatar || null,
      });
      
      await webhook.send({ content: message });
      await interaction.reply({ content: `✅ Webhook **${name}** créé et message envoyé !`, ephemeral: true });
      
      // Optionnel: supprimer le webhook après envoi si vous voulez juste un message "fantôme"
      // await webhook.delete();
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Erreur lors de la création du Webhook. Vérifiez mes permissions.', ephemeral: true });
    }
  }
};
