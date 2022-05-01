const { MessageEmbed } = require('discord.js')

const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId)

  if (!queue || !queue.playing) return await interaction.reply('There are no songs in the queue')

  let bar = queue.createProgressBar({
    queue: false,
    length: 19
  })

  const song = queue.current
  
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setThumbnail(song.thumbnail)
        .setDescription(`Currently playing [${song.title}](${song.url})\n\n` + bar)
    ]
  })
}

module.exports = {
  name: 'nowplaying',
  description: 'Shows information about the currently playing track',
  perm: '',
  run
}