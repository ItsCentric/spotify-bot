const { MessageEmbed } = require("discord.js");

const run = async (client, interaction) => {
  const about = new MessageEmbed()
    .setColor("#38d65e")
    .setTitle("About Spotify Bot")
    .setDescription("Spotify was made by **isaiah !#1608** on February 7th, 2022 and coded in JavaScript. A short break was taken on February 9th and development resumed on April 25th, 2022.")
    .setThumbnail("http://www.soft32.com/blog/wp-content/uploads/2016/08/spotify_logo.png")

  await interaction.reply({embeds: [about]});
}

module.exports = {
  name: "about",
  description: "About Spotify bot.",
  perm: "",
  run
}