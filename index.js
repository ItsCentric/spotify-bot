const Discord = require("discord.js");
const keepAlive = require("./server");

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

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.slashcommands = new Discord.Collection();
client.buttons = new Discord.Collection();

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload);
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload);
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload);
client.loadButtons = (bot, reload) => require("./handlers/buttons")(bot, reload);
    
client.loadEvents(bot, false);
client.loadCommands(bot, false);
client.loadSlashCommands(bot, false);
client.loadButtons(bot, false);

client.on("ready", () => {
    client.user.setActivity("with your mother", { type: "PLAYING" })
})

client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return
    if (!interaction.inGuild()) return interaction.reply("This command can only be used in a server.")

    const slashcmd = client.slashcommands.get(interaction.commandName)

    if (!slashcmd) return interaction.reply("Invalid slash command")

    if (slashcmd.perm && !interaction.member.permissions.has(slashcmd.perm)) return interaction.reply("You do not have permission to execute this command.")

    slashcmd.run(client, interaction)
})

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

module.exports = bot;

keepAlive();
client.login(DISCORD_CLIENT_TOKEN);