const { getToken, spotifySearch } = require("../util/functions");
const request = require("request");
const { MessageEmbed } = require("discord.js");

const run = async (client, interaction) => {
  var tokenParam;
  getToken((token) => {
    tokenParam = token;
    const name = interaction.options.getString("name");
    spotifySearch(encodeURIComponent(name), "artist", 1, (searchResults, tokenParam) => {
      if(searchResults.artists.items.length == 0) {
        interaction.reply(`Cannot find artist with the name "${name}"`)
        return
      }
      
      var id = searchResults.artists.items[0].id;
          
      var options = {
        'method': 'GET',
        'url': `https://api.spotify.com/v1/artists/${id}`,
        'headers': {
          'Authorization': `Bearer ${token}`
        },
        json: true
      };
      request(options, async (error, response, body) => {
        if (error) throw new Error(error);
        const artistInfo = new MessageEmbed()
          .setColor("#fff")
          .setTitle(response.body.name)
          .setURL(response.body.external_urls.spotify)
          .setImage(response.body.images[0].url)
          .addFields(
            {name: "Genres", value: response.body.genres[0], inline: true},
            {name: "Followers", value: `${response.body.followers.total}`, inline: true}
          )
  
        await interaction.reply({embeds: [artistInfo]})
      })
    });
  });
}

module.exports = {
  name: "artistinfo",
  description: "Gets information about an artist.",
  perm: "",
  options: [
    {
      name: "name",
      description: "The name of the artist you are requesting.",
      type: "STRING",
      required: true
    }
  ],
  run
}