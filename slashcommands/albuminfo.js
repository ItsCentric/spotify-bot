const { getToken, spotifySearch, convertDuration } = require("../util/functions");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const request = require("request");

var albumInfo, albumTracks, slashCommandId;
var albumEmbeds = {
  albumInfo,
  albumTracks,
  slashCommandId
};

const run = async (client, interaction) => {
  var tokenParam;
  albumEmbeds.slashCommandId = interaction.id;
  
  getToken((token) => {
    tokenParam = token;
    const name = interaction.options.getString("name");
    spotifySearch(encodeURIComponent(name), "album", 1, async (searchResults, tokenParam) => {
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

        const releaseDate = (response.body.release_date).substring(5, 7) + "/" + (response.body.release_date).substring(8) + "/" + (response.body.release_date).substring(0, 4);
        let artistNames = [];
        let albumName = response.body.name;
        let albumImage = response.body.images[0].url;

        for (i = 0; i < response.body.artists.length; i++) {
          artistNames.push(response.body.artists[i].name);
        }
        albumEmbeds.albumInfo = new MessageEmbed()
          .setColor("#38d65e")
          .setTitle(response.body.name)
          .setURL(response.body.external_urls.spotify)
          .setImage(response.body.images[0].url)
          .addFields(
            {name: "Artists", value: artistNames.join(', '), inline: true},
            {name: "# of Tracks", value: `${response.body.total_tracks}`, inline: true},
            {name: "Release Date", value: releaseDate, inline: true}
          )
        if (interaction.options.getBoolean('tracks')) {
          let tracksString = '';
          var options = {
            'method': 'GET',
            'url': `https://api.spotify.com/v1/albums/${id}/tracks`,
            'headers': {
              'Authorization': `Bearer ${token}`
            },
            json: true
          };
          request(options, async (error, response) => {
            if(error) throw new Error(error);
  
            for (i = 0; i < response.body.items.length; i++) {
              // const seconds = response.body.items[i].duration_ms / 1000
              // let durationSeconds = Math.round(seconds % 60);
              // const durationMinutes = Math.round((seconds - durationSeconds) / 60)

              // if (durationSeconds < 10) {
              //   durationSeconds = String(durationSeconds / 10);
              //   durationSeconds = durationSeconds[0] + durationSeconds[2]
              // }
              convertDuration(response.body.items[i].duration_ms, newDuration);
              
              tracksString = tracksString + `${i + 1}.) ${response.body.items[i].name} [${newDuration}]\n`;
            }
            albumEmbeds.albumTracks = new MessageEmbed()
              .setColor('#ffffff')
              .setThumbnail(`${albumImage}`)
              .setTitle(`${albumName}'s Tracks`)
              .setDescription(`${tracksString}`)
              .setFooter({ text: `${response.body.total} tracks` })
          });
        }
        await interaction.reply(
          {
            embeds: [albumEmbeds.albumInfo],
            components: [
              new MessageActionRow().addComponents([
                new MessageButton().setCustomId(`albuminfobutton-previous`).setLabel('Previous').setStyle('PRIMARY'),
                new MessageButton().setCustomId(`albuminfobutton-next`).setLabel("Next").setStyle("PRIMARY")
              ])
            ]
          }) 
      });
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
      type: 3,
      required: true
    },
    {
      name: 'tracks',
      description: 'Get the tracks in the album',
      type: 5,
      required: false
    }
  ],
  albumEmbeds,
  run
}