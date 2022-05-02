const { getToken, spotifySearch } = require("../util/functions");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const request = require("request");
const intl = require('intl');

var playlistInfo;
var playlistEmbeds = {
  playlistInfo
}

const run = (client, interaction) => {
  var tokenParam;
  getToken((token) => {
    tokenParam = token;
    const name = interaction.options.getString("name");
    spotifySearch(encodeURIComponent(name), "playlist", 1, (searchResults, tokenParam) => {
      if(searchResults.playlists.items.length == 0) {
        interaction.reply(`Cannot find a playlist with the name "${name}"`)
        return
      }
      
      var id = searchResults.playlists.items[0].id;
          
      var options = {
        'method': 'GET',
        'url': `https://api.spotify.com/v1/playlists/${id}`,
        'headers': {
          'Authorization': `Bearer ${token}`
        },
        json: true
      };
      request(options, async (error, response) => {
        if (error) throw new Error(error);
        playlistEmbeds.playlistInfo = new MessageEmbed()
          .setColor("#38d65e")
          .setTitle(response.body.name)
          .setDescription(response.body.description)
          .setURL(response.body.external_urls.spotify)
          .setImage(response.body.images[0].url)
          .addFields(
            { name: "Owner", value: `[${response.body.owner.display_name}](${response.body.owner.external_urls.spotify})`, inline: true },
            { name: "Followers", value: (response.body.followers.total).toLocaleString('en-US'), inline: true },
            { name: '# of Tracks', value: `${response.body.tracks.items.length}`, inline: true },
            { name: 'Public', value: `${response.body.public}`, inline: true }
          );
  
        await interaction.reply({ embeds: [playlistEmbeds.playlistInfo] });
      })
    });
  });
}

module.exports = {
  name: 'playlistinfo',
  description: 'Gets information about a playlist',
  perm: '',
  options: [
    {
      name: 'name',
      description: 'The name of the playlist you want to get',
      type: 3,
      required: true
    }
  ],
  run
}