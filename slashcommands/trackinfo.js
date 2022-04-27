const { getToken, spotifySearch } = require("../util/functions");
const request = require("request");
const { MessageEmbed } = require("discord.js");

// fix this thingy

const run = async (client, interaction) => {
  var tokenParam;
  getToken((token) => {
    tokenParam = token;
    const name = interaction.options.getString("name")
    spotifySearch(encodeURIComponent(name), "track", 1, (searchResults, tokenParam) => {
      var id = searchResults.tracks.items[0].id;
      
      var options = {
        'method': 'GET',
        'url': `https://api.spotify.com/v1/tracks/${id}`,
        'headers': {
          'Authorization': `Bearer ${token}`
        },
        json: true
      };
      request(options, async (error, response) => {
        if (error) throw new Error(error);
        const seconds = response.body.duration_ms / 1000
        const durationSeconds = seconds % 60
        const durationMinutes = (seconds - durationSeconds) / 60
        const releaseDate = (response.body.album.release_date).substring(5, 7) + "/" + (response.body.album.release_date).substring(8) + "/" + (response.body.album.release_date).substring(0, 4)
        const trackInfo = new MessageEmbed()
          .setColor("#fff")
          .setTitle(response.body.name)
          .setURL(response.body.external_urls.spotify)
          .setImage(response.body.album.images[0].url)
          .addFields(
            {name: "Artist", value: response.body.artists[0].name, inline: true},
            {name: "Release Date", value: releaseDate, inline: true},
            {name: "Duration", value: `${Math.round(durationMinutes)}:${Math.round(durationSeconds)}`, inline: true}
          )
  
        await interaction.reply({embeds: [trackInfo]})
      });
    });
  });
}

module.exports = {
  name: "trackinfo",
  description: "Gets information about a track.",
  perm: "",
  options: [
    {
      name: "name",
      description: "The name of the track you are requesting.",
      type: "STRING",
      required: true
    }
  ],
  run
}