const { getToken, spotifySearch, roundTo } = require("../util/functions");
const request = require("request");
const { MessageEmbed } = require("discord.js");

const run = async (client, interaction) => {
  var tokenParam;
  getToken((token) => {
    tokenParam = token;
    const name = interaction.options.getString("name")
    spotifySearch(encodeURIComponent(name), "track", 1, (searchResults, tokenParam) => {
      if(searchResults.tracks.items.length == 0) {
        interaction.reply(`Cannot find song with the name "${name}"`)
        return
      }
      
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
        let durationSeconds = seconds % 60;
        const durationMinutes = (seconds - durationSeconds) / 60
        const releaseDate = (response.body.album.release_date).substring(5, 7) + "/" + (response.body.album.release_date).substring(8) + "/" + (response.body.album.release_date).substring(0, 4)
        let artistNames = []
        
        if (durationSeconds < 10) {
          durationSeconds = String(durationSeconds / 10);
          durationSeconds = durationSeconds[0] + durationSeconds[2]
        }
        for (i = 0; i < response.body.artists.length; i++) {
          artistNames.push(response.body.artists[i].name)
        }

        const trackInfo = new MessageEmbed()
          .setColor("#ffffff")
          .setTitle(response.body.name)
          .setURL(response.body.external_urls.spotify)
          .setImage(response.body.album.images[0].url)
          .addFields(
            {name: "Artists", value: artistNames.join(', '), inline: true},
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
      type: 3,
      required: true
    }
  ],
  run
}