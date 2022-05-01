const Discord = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");

const DISCORD_CLIENT_TOKEN = process.env["DISCORD_CLIENT_TOKEN"];
const LOAD_SLASH = process.argv[2] == 'load'
const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_MEMBERS",
    'GUILD_VOICE_STATES'
  ]
});
let bot = {
    client,
    prefix: "+",
    owners: "384518472383725568"
};
client.slashcommands = new Discord.Collection();
// client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload);    
// client.loadSlashCommands(bot, false);
const CLIENT_ID = '931765113327874058';
const guildID = "796184020236894228"; //homie hangout
// const guildID = "964565056320860222"; // alabasta
let commands = []
const slashFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'))


for (const file of slashFiles) {
  const slashcmd = require(`./slashcommands/${file}`)
  client.slashcommands.set(slashcmd.name, slashcmd)
  if (LOAD_SLASH) commands.push(slashcmd)
}

if (LOAD_SLASH) {
  const rest = new REST({ version: '9' }).setToken(DISCORD_CLIENT_TOKEN)
  console.log('Deploying slash commands')
  rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildID), { body: commands})
    .then(() => {
      console.log('Successfully loaded slash commands')
      process.exit(0)
    })
    .catch((err) => {
      console.log(err)
      process.exit(1)
    })
}



client.login(DISCORD_CLIENT_TOKEN);

// client.on("ready", async () => {
//     const guild = client.guilds.cache.get(guildID)
//     if (!guild) {
//         return console.error("Target guild not found")
//     }
//     await guild.commands.set([...client.slashcommands.values()])
//     console.log(`Successfully loaded ${client.slashcommands.size} slash commands.`)
//     process.exit(0)
// })