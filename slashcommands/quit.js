const { MessageEmbed } = require('discord.js')

const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId)

  if (!queue || !queue.playing) return await interaction.reply('There are no songs in the queue')

  queue.destroy()
  await interaction.reply('Bye!')
}

module.exports = {
  name: 'quit',
  description: 'Clears the queue and leaves the voice channel',
  perm: '',
  run
}