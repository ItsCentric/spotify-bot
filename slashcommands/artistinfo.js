const { getToken, spotifySearch } = require("../util/functions");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const request = require("request");

var artistInfo
var artistTopTracks = []
var slashCommandId;
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
      request(options, async (error, response, body) => {
        if (error) throw new Error(error);

        artistEmbeds.artistInfo = new MessageEmbed()
          .setColor("#ffffff")
          .setTitle(response.body.name)
          .setURL(response.body.external_urls.spotify)
          .setImage(response.body.images[0].url)
          .addFields(
            { name: "Genres", value: response.body.genres[0], inline: true },
            { name: "Followers", value: `${response.body.followers.total}`, inline: true }
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
              const seconds = response.body.tracks[i].duration_ms / 1000
              const durationSeconds = seconds % 60
              const durationMinutes = (seconds - durationSeconds) / 60
              artistEmbeds.artistTopTracks.push(new MessageEmbed()
                .setColor("#ffffff")
                .setTitle(response.body.tracks[i].name)
                .setURL(response.body.tracks[i].external_urls.spotify)
                .setImage(response.body.tracks[i].album.images[0].url)
                .addFields(
                  { name: "Release Date", value: response.body.tracks[i].album.release_date },
                  { name: "Duration", value: `${durationMinutes}:${Math.round(durationSeconds)}` }
                ));
              }
          });
        }

        await interaction.reply({
          embeds: [artistEmbeds.artistInfo],
          components: [
            new MessageActionRow().addComponents([
              new MessageButton().setCustomId(`artistinfobutton-previous`).setLabel('Previous').setStyle('PRIMARY'),
              new MessageButton().setCustomId(`artistinfobutton-next`).setLabel("Next").setStyle("PRIMARY")
            ])
          ]
        })
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
    },
    {
      name: "toptracks",
      description: "Show the artist's top three tracks.",
      type: "BOOLEAN",
      required: false
    }
  ],
  artistEmbeds,
  run
}