const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId);

  if (!queue || !queue.playing) return await interaction.reply('There are no songs in the queue');

  const trackNum = interaction.options.getNumber('tracknumber');

  if (trackNum > queue.tracks.length) return await interaction.reply('Invalid track number');

  if (interaction.options.getBoolean('remove')) queue.skipTo(trackNum - 1);
  else queue.jump(trackNum - 1);
  
  await interaction.reply(`Skipped to track ${trackNum}`);
}

module.exports = {
  name: 'skipto',
  description: 'Skips to the specified place in the queue',
  perm: '',
  options: [
    {
      name: 'tracknumber',
      description: 'The number in the queue the track you want to skip to is',
      type: 10,
      min_value: 1,
      required: true,
    },
    {
      name: 'remove',
      description: 'Do you want to remove the tracks up to this track?',
      type: 5,
      required: false
    }
  ],
  run
}