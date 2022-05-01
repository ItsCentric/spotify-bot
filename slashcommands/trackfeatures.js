const { getToken, spotifySearch } = require("../util/functions");
const { MessageEmbed } = require("discord.js");
const request = require("request");

const run = async (client, interaction) => {
  var tokenParam;
  getToken((token) => {
    tokenParam = token;
    var name = interaction.options.getString("name");
    spotifySearch(encodeURIComponent(name), "track", 1, (searchResults, tokenParam) => {
      if(searchResults.tracks.items.length == 0) {
        interaction.reply(`Cannot find song with the name "${name}"`)
        return
      }
      
      var id = searchResults.tracks.items[0].id;
          
      var options = {
        'method': 'GET',
        'url': `https://api.spotify.com/v1/audio-features/${id}`,
        'headers': {
          'Authorization': `Bearer ${token}`
        },
        json: true
      };
      request(options, async (error, response, body) => {
        if (error) throw new Error(error);
        const trackFeatures = new MessageEmbed()
          .setColor("#ffffff")
          .setTitle(`${name[0].toUpperCase() + name.substring(1)}'s Track Features`)
          .addFields(
            {name: "Acousticness", value: `${response.body.acousticness}`, inline: true},
            {name: "Danceability", value: `${response.body.danceability}`, inline: true},
            {name: "Energy", value: `${response.body.energy}`, inline: true},
            {name: "Loudness", value: `${response.body.loudness} dB`, inline: true},
            {name: "Scale", value: response.body.mode == 1 ? "Major" : "Minor", inline: true},
            {name: "Tempo", value: `${response.body.tempo} BPM`, inline: true},
            {name: "Time Signature", value: `${response.body.time_signature}`, inline: true}
          )
  
        await interaction.reply({embeds: [trackFeatures]})
      })
    });
  });
}

module.exports = {
  name: "trackfeatures",
  description: "Gets the features of a track.",
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