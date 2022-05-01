const { MessageEmbed } = require('discord.js')

const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId)

  if (!queue || !queue.playing) return await interaction.reply('There are no songs in the queue')

  queue.setPaused(false)
  await interaction.reply('Bye!')
}

module.exports = {
  name: 'resume',
  description: 'Resumes the currently paused track',
  perm: '',
  run
}