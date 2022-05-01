const { getToken, spotifySearch } = require("../util/functions");
const { MessageEmbed } = require("discord.js");
const request = require("request");

const run = async (client, interaction) => {
  getToken((token) => {
    var user_id = interaction.options.getString("id");
          
    var options = {
      'method': 'GET',
      'url': `https://api.spotify.com/v1/users/${user_id}`,
      'headers': {
        'Authorization': `Bearer ${token}`
      },
      json: true
    };
    request(options, async (error, response) => {
      if (error) throw new Error(error);
      const userInfo = new MessageEmbed()
        .setColor("#ffffff")
        .setTitle(response.body.display_name)
        .setURL(response.body.external_urls.spotify)
        .setThumbnail(response.body.images[0].url)
        .addFields(
          {name: "Followers", value: `${response.body.followers.total}`, inline: false}
        )
  
      await interaction.reply({embeds: [userInfo]})
    });
  });
}

module.exports = {
  name: "userinfo",
  description: "Get information about a user.",
  perm: "",
  options: [
    {
      name: "id",
      description: "The ID of the user you are requesting.",
      type: 3,
      required: true
    }
  ],
  run
}