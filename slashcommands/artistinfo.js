const { getToken, spotifySearch } = require("../util/functions");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const request = require("request");
const intl = require('intl')

var artistInfo
var artistTopTracks = []
var slashCommandId;
// variable exports to artistinfobutton
var artistEmbeds = {
  artistInfo,
  artistTopTracks,
  slashCommandId
}

const run = async (client, interaction) => {
  var tokenParam;
  artistEmbeds.slashCommandId = interaction.id;

  getToken((token) => {
    tokenParam = token;
    const name = interaction.options.getString("name");
    spotifySearch(encodeURIComponent(name), "artist", 1, (searchResults, tokenParam) => {
      if (searchResults.artists.items.length == 0) {
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
      request(options, async (error, response) => {
        if (error) throw new Error(error);

        let artistGenres = [];

        for (i = 0; i < response.body.genres.length; i++) {
          artistGenres.push(response.body.genres[i]);
        }

        artistEmbeds.artistInfo = new MessageEmbed()
          .setColor("#38d65e")
          .setTitle(response.body.name)
          .setURL(response.body.external_urls.spotify)
          .setImage(response.body.images[0].url)
          .addFields(
            { name: "Genres", value: artistGenres.join(', '), inline: true },
            { name: "Followers", value: (response.body.followers.total).toLocaleString('en-US'), inline: true }
          )

        if (interaction.options.getBoolean("toptracks")) {
          var options = {
            'method': 'GET',
            'url': `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`,
            'headers': {
              'Authorization': `Bearer ${token}`
            },
            json: true
          };

          request(options, async (error, response) => {
            if (error) throw new Error(error);
            artistEmbeds.artistTopTracks = [];
            for (i = 0; i < 3; i++) {
              const seconds = response.body.tracks[i].duration_ms / 1000;
              let durationSeconds = Math.round(seconds % 60);
              const durationMinutes = Math.round((seconds - durationSeconds) / 60);
              const releaseDate = (response.body.tracks[i].album.release_date).substring(5, 7) + "/" + (response.body.tracks[i].album.release_date).substring(8) + "/" + (response.body.tracks[i].album.release_date).substring(0, 4);
              let artistNames = [];

              if (durationSeconds < 10) {
                durationSeconds = String(durationSeconds / 10);
                durationSeconds = durationSeconds[0] + durationSeconds[2];
              }
              for (j = 0; j < response.body.tracks[i].artists.length; j++) {
                artistNames.push(response.body.tracks[i].artists[j].name);
              }
              artistEmbeds.artistTopTracks.push(new MessageEmbed()
                .setColor("#ffffff")
                .setTitle(response.body.tracks[i].name)
                .setURL(response.body.tracks[i].external_urls.spotify)
                .setImage(response.body.tracks[i].album.images[0].url)
                .addFields(
                  { name: 'Artists', value: artistNames.join(', '), inline: true },
                  { name: "Release Date", value: releaseDate, inline: true },
                  { name: "Duration", value: `${durationMinutes}:${durationSeconds}`, inline: true }
                ));
            }
          });
        }

        if(interaction.options.getBoolean('toptracks')) {
          await interaction.reply({
            embeds: [artistEmbeds.artistInfo],
            components: [
              new MessageActionRow().addComponents([
                new MessageButton().setCustomId(`artistinfobutton-previous`).setLabel('Previous').setStyle('PRIMARY'),
                new MessageButton().setCustomId(`artistinfobutton-next`).setLabel("Next").setStyle("PRIMARY")
              ])
            ]
          });
        }
        else await interaction.reply({ embeds: [artistEmbeds.artistInfo] });
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
      type: 3,
      required: true
    },
    {
      name: "toptracks",
      description: "Show the artist's top three tracks.",
      type: 5,
      required: false
    }
  ],
  artistEmbeds,
  run
}