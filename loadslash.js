const Discord = require("discord.js");

const DISCORD_CLIENT_TOKEN = process.env["DISCORD_CLIENT_TOKEN"];

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
});

let bot = {
    client,
    prefix: "+",
    owners: "384518472383725568"
};

const guildID = "796184020236894228";

client.slashcommands = new Discord.Collection();
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload);    
client.loadSlashCommands(bot, false);

client.login(DISCORD_CLIENT_TOKEN);

client.on("ready", async () => {
    const guild = client.guilds.cache.get(guildID)
    if (!guild) {
        return console.error("Target guild not found")
    }
    await guild.commands.set([...client.slashcommands.values()])
    console.log(`Successfully loaded ${client.slashcommands.size} slash commands.`)
    process.exit(0)
})