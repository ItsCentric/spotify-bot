const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player")

const run = async (client, interaction) => {
  if (!interaction.member.voice.channel) return interaction.reply('You are not in a voice channel.')

  const queue = await client.player.createQueue(interaction.guild)
  if (!queue.connection) await queue.connect(interaction.member.voice.channel)

  let embed = new MessageEmbed()

  if (interaction.options.getSubcommand() === 'song') {
    let url = interaction.options.getString('url')
    const result = await client.player.search(url, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_VIDEO
    })

    if (result.tracks.length === 0) return interaction.reply("Couldn't find a song with that URL.")

    const song = result.tracks[0]
    await queue.addTrack(song)
    embed
      .setDescription(`**[${song.title}](${song.url})** has been added to the queue`)
    .setThumbnail(song.thumbnail)
    .setFooter({ text: `Duration: ${song.duration}`})
  }
  else if (interaction.options.getSubcommand() === 'playlist') {
    let url = interaction.options.getString('url')
    const result = await client.player.search(url, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_PLAYLIST
    })

    if (result.tracks.length === 0) return interaction.reply("Couldn't find a playlist with that URL.")

    const playlist = result.playlist
    await queue.addTracks(result.tracks)
    embed
      .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** has been added to the queue`)
    .setThumbnail(playlist.thumbnail)
    // .setFooter({ text: `Duration: ${playlist.duration}`})
  }
  else if (interaction.options.getSubcommand() === 'search') {
    let url = interaction.options.getString('query')
    const result = await client.player.search(url, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO
    })

    if (result.tracks.length === 0) return interaction.reply("Couldn't find a song with that URL.")

    const song = result.tracks[0]
    await queue.addTrack(song)
    embed
      .setDescription(`**[${song.title}](${song.url})** has been added to the queue`)
    .setThumbnail(song.thumbnail)
    .setFooter({ text: `Duration: ${song.duration}`})
  }

  if (!queue.playing) await queue.play()
  await interaction.reply({ embeds: [embed]})
}

module.exports = {
  name: 'play',
  description: 'Play a song or playlist from a URL or search for a song',
  perm: '',
  options: [
    {
      name: 'song',
      description: 'Play a single song from a URL',
      type: 1,
      options: [
        {
          name: 'url',
          description: 'The URL of the song you want to play',
          type: 3,
          required: true
        }
      ]
    },
    {
      name: 'playlist',
      description: 'Play a playlist from a URL',
      type: 1,
      options: [
        {
          name: 'url',
          description: 'The URL of the playlist you want to play',
          type: 3,
          required: true
        }
      ]
    },
    {
      name: 'search',
      description: 'Search for a song to play',
      type: 1,
      options: [
        {
          name: 'query',
          description: 'The song you want to search for',
          type: 3,
          required: true
        }
      ]
    }
  ],
  run
}