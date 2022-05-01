const { MessageEmbed } = require('discord.js')

const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId)

  if (!queue || !queue.playing) return await interaction.reply('There are no songs in the queue')

  queue.setPaused(true)
  await interaction.reply('Track has been paused')
}

module.exports = {
  name: 'pause',
  description: 'Pauses the currently playing track',
  perm: '',
  run
}