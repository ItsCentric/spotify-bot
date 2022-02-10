const run = async (client, interaction) => {
    interaction.reply(`Pong! With a latency of ${Date.now() - interaction.createdTimestamp}ms.`)
}

module.exports = {
    name: "ping",
    description: "Determines the latency of the bot.",
    perm: "",
    options: [
        {
            name: "ping",
            description: "Determines the latency of the bot.",
            type: "STRING",
            required: false
        }
    ],
    run
}