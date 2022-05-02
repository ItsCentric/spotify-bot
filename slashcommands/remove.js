const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId);
  const songsToRemove = interaction.options.getString('trackposition').split(' ');

  for (i = 0; i < songsToRemove.length; i++) {
    queue.remove(queue.tracks[songsToRemove[i] - 1]);
  }

  await interaction.reply(`Removed ${songsToRemove.length} tracks!`)
}

module.exports = {
  name: 'remove',
  description: 'Removes the track(s) from the queue',
  perm: '',
  options: [
    {
      name: 'trackposition',
      description: 'The position in the queue of the track(s) you want to remove. Separate by spaces',
      type: 3,
      required: true
    }
  ],
  run
}