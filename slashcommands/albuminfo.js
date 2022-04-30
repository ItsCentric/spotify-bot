const { getToken, spotifySearch } = require("../util/functions");
const { MessageEmbed } = require("discord.js");
const request = require("request");

const run = async (client, interaction) => {
  var tokenParam;
  getToken((token) => {
    tokenParam = token;
    const name = interaction.options.getString("name");
    spotifySearch(encodeURIComponent(name), "album", 1, (searchResults, tokenParam) => {
      if(searchResults.albums.items.length == 0) {
        interaction.reply(`Cannot find album with the name "${name}"`)
        return
      }
      
      var id = searchResults.albums.items[0].id;
          
      var options = {
        'method': 'GET',
        'url': `https://api.spotify.com/v1/albums/${id}`,
        'headers': {
          'Authorization': `Bearer ${token}`
        },
        json: true
      };
      request(options, async (error, response) => {
        if (error) throw new Error(error);
        // for (i=0; i<=response.body.artists.length; i++) {
          
        // }
        const albumInfo = new MessageEmbed()
          .setColor("#ffffff")
          .setTitle(response.body.name)
          .setURL(response.body.external_urls.spotify)
          .setImage(response.body.images[0].url)
          .addFields(
            {name: "Artists", value: response.body.artists[0].name, inline: true},
            {name: "# of Tracks", value: `${response.body.total_tracks}`, inline: true},
            {name: "Release Date", value: response.body.release_date, inline: true}
          )

        console.log('interaction triggered')
        await interaction.reply({embeds: [albumInfo]})
      })
    });
  });
}

module.exports = {
  name: "albuminfo",
  description: "Get information about an album.",
  perm: "",
  options: [
    {
      name: "name",
      description: "The name of the album you are requesting.",
      type: "STRING",
      required: true
    }
  ],
  run
}