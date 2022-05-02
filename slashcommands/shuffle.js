const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId);

  if (!queue || !queue.playing) return await interaction.reply('There are no songs in the queue');

  queue.shuffle();
  await interaction.reply(`${queue.tracks.length} songs have been shuffled`);
}

module.exports = {
  name: 'shuffle',
  description: 'Shuffles the tracks in the current queue',
  perm: '',
  run
}