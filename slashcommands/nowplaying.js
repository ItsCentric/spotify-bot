const { MessageEmbed } = require('discord.js');
const { convertDuration } = require('../util/functions.js');

const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId);

  if (!queue || !queue.playing) return await interaction.reply('There are no songs in the queue');

  let bar = queue.createProgressBar({
    queue: false,
    length: 19
  });

  const song = queue.current;
  var duration;

  convertDuration(song.duration, (newDuration) => {
    duration = newDuration;
  });
  
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setThumbnail(song.thumbnail)
        .setDescription(`Currently playing [${song.title}](${song.url})\n\n` + `0:00 ${bar} ${duration}`)
        .setColor('#38d65e');
    ]
  });
}

module.exports = {
  name: 'nowplaying',
  description: 'Shows information about the currently playing track',
  perm: '',
  run
}