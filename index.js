const Discord = require("discord.js")
const TOKEN = "OTMxNzY1MTEzMzI3ODc0MDU4.YeJL4g.WljNszJNFl0aX90UFJaJIuWAiOU"
var client_id = "5aeee83ef9764a8daf6b4951a25a3ccc";
var client_secret = "eff5ab6f3b224f65a353050e22054600"

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
})

let bot = {
    client,
    prefix: "+",
    owners: "384518472383725568"
}

client.commands = new Discord.Collection()
client.events = new Discord.Collection()

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
    
client.loadEvents(bot, false)
client.loadCommands(bot, false)

module.exports = bot

client.login(TOKEN)