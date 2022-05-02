const { MessageEmbed } = require('discord.js')
const { convertDuration } = require('../util/functions.js');

const run = async (client, interaction) => {
  const queue = client.player.getQueue(interaction.guildId);
  let duration;
  convertDuration(queue.totalTime, (newDuration) => {
    duration = newDuration;
  });

  if (!queue || !queue.playing) return await interaction.reply('There are no songs in the queue');

  const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
  const page = (interaction.options.getNumber('page') || 1) - 1;

  if (page > totalPages) return interaction.reply(`Invalid page. There are only ${totalPages} in this queue`);

  // gets the 10 songs on the page specified and the next 10 songs, and maps the song and the song information to a string. (song) = the song object and (i) = the index of the song in the array
  const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
    return `**${page * 10 + i + 1}**.) \`[${song.duration}]\` **[${song.title}](${song.url})** -- <@${song.requestedBy.id}>`
  }).join('\n');

  const currentSong = queue.current;

  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setDescription(`**Currently Playing**\n` +
        (currentSong ? `\`[${currentSong.duration}]\` **[${currentSong.title}](${currentSong.url})** -- <@${currentSong.requestedBy.id}>` : 'None') +
        `\n\n**Queue**\n${queueString}`)
        .setColor('#38d65e')
        .setFooter({
          text: `${queue.tracks.length} tracks || ${duration} left || Page ${page + 1} of ${totalPages}`
        })
        .setThumbnail(currentSong.thumbnail)
    ]
  });
}

module.exports = {
  name: 'queue',
  description: 'Displays the current queue',
  perm: '',
  options: [
    {
      name: 'page',
      description: 'Display this page of the queue',
      type: 10,
      min_value: 1
    }
  ],
  run
}