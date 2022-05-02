const { MessageEmbed } = require('discord.js');
const { slashCommandInfo } = require('../slashcommands/play.js');
const { convertDuration } = require('../util/functions.js');

module.exports = {
  name: 'trackStart',
  run: async (bot, interaction) => {
    const { client } = bot;
    const channel = client.channels.cache.get(slashCommandInfo.channelId);
    const queue = client.player.getQueue(interaction.guild.id);
    var duration;

    convertDuration(queue.totalTime, (newDuration) => {
      duration = newDuration;
    });

    if (!queue && duration !== '0:0') {
      const nowPlaying = new MessageEmbed()
        .setTitle(`**Now Playing:**`)
        .setDescription(`**[${queue.current.title}](${queue.current.url})** [${queue.current.duration}] -- Requested by <@${queue.current.requestedBy.id}>`)
        .setThumbnail(`${queue.current.thumbnail}`)
        .setFooter({ text: `${queue.tracks.length} tracks left for a total of ${duration}`})
        .setColor('#38d65e');
  
      await channel.send({ embeds: [nowPlaying] });
    }
    else {
      const nowPlayingNoNext = new MessageEmbed()
        .setTitle(`**Now Playing:**`)
        .setDescription(`**[${queue.current.title}](${queue.current.url})** [${queue.current.duration}] -- Requested by <@${queue.current.requestedBy.id}>`)
        .setThumbnail(`${queue.current.thumbnail}`)
        .setFooter({ text: `No tracks in the queue`})
        .setColor('#38d65e');
  
      await channel.send({ embeds: [nowPlayingNoNext] });
    }
  }
}