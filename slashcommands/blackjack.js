const { MessageEmbed } = require("discord.js");

const run = async (client, interaction) => {
    const bjEmbed = new MessageEmbed()
        .setColor("#fff")
        .setTitle("Welcome to Blackjack!")
        .setURL("https://www.casino.org/blackjack/how-to-play/")
        .setDescription("If you don't know what blackjack is, click on the embed title to learn how to play.")
    
    // const continue = 

    await interaction.reply({ embeds: [bjEmbed] })

}

module.exports = {
    name: "blackjack",
    description: "Starts a new game of blackjack.",
    perm: "",
    run
}