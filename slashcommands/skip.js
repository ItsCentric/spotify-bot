const { MessageEmbed } = require('discord.js');

const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId);

  if (!queue || !queue.playing) return await interaction.reply('There are no songs in the queue');

  const currentSong = queue.current;
  
  queue.skip();
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setDescription(`Skipped ${currentSong.title}`)
        .setThumbnail(currentSong.thumbnail)
        .setColor('#38d65e');
    ]
  })
}

module.exports = {
  name: 'skip',
  description: 'Skips the current track',
  perm: '',
  run
}