const run = async (client, interaction) => {
    interaction.reply(interaction.options.getString("say"))
}

module.exports = {
    name: "say",
    description: "Repeats what comes after the command.",
    perm: "",
    options: [
        {
            name: "say",
            description: "What you want me to say!",
            type: "STRING",
            required: true
        }
    ],
    run
}