'use strict';

require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http');

// 1. Démarrage du serveur de survie Railway immédiatement
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot Ultimate is running');
}).listen(PORT, () => console.log(`🌐 [WEB] Port ${PORT} actif.`));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection();

// 2. Système de Base de Données JSON (Stable & Rapide)
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbFile = path.join(dataDir, 'database.json');
let db = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile)) : { guilds: {}, users: {} };

const saveDB = () => fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

// 3. Chargeur de Modules (Architecture Professionnelle)
const loadModules = () => {
  const cmdPath = path.join(__dirname, 'commands');
  const categories = fs.readdirSync(cmdPath);
  for (const cat of categories) {
    const catPath = path.join(cmdPath, cat);
    if (!fs.lstatSync(catPath).isDirectory()) continue;
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const commandModule = require(path.join(catPath, file));
      const commands = Array.isArray(commandModule) ? commandModule : [commandModule];
      for (const cmd of commands) {
        if (cmd.data) client.commands.set(cmd.data.name, cmd);
      }
    }
  }
  
  // Chargement des événements
  const eventPath = path.join(__dirname, 'events');
  const eventCats = fs.readdirSync(eventPath);
  for (const cat of eventCats) {
    const catPath = path.join(eventPath, cat);
    if (!fs.lstatSync(catPath).isDirectory()) continue;
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const event = require(path.join(catPath, file));
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client, db, saveDB));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client, db, saveDB));
      }
    }
  }
  
  console.log(`📦 [SYSTEM] ${client.commands.size} commandes chargées.`);
};

// 4. Événement Ready
client.once('ready', async () => {
  console.log(`✅ [DISCORD] Connecté : ${client.user.tag}`);
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    const body = Array.from(client.commands.values()).map(c => c.data.toJSON());
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body });
    console.log('✅ [DISCORD] Commandes Slash synchronisées.');
  } catch (e) {
    console.error('❌ [DISCORD] Erreur synchro :', e.message);
  }
});

// 5. Gestionnaire d'interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction, client, db, saveDB);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: 'Erreur lors de l\'exécution !', ephemeral: true }).catch(() => {});
  }
});

// 6. Lancement
const start = async () => {
  if (!process.env.DISCORD_TOKEN) return console.error('❌ DISCORD_TOKEN MANQUANT');
  loadModules();
  await client.login(process.env.DISCORD_TOKEN);
};

start().catch(console.error);
setInterval(() => console.log('💓 [HEARTBEAT] Bot en ligne...'), 300000);
