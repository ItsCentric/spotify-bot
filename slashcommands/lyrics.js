const Genius = require('genius-lyrics');
const { MessageEmbed } = require('discord.js');

const run = async (client, interaction) => {
  const GENIUS_AUTH_TOKEN = process.env['GENIUS_AUTH_KEY']
  const Client = new Genius.Client(GENIUS_AUTH_TOKEN)
  const queue = client.player.getQueue(interaction.guildId)

  if (queue.current === null) await interaction.reply('There is no song currently playing')

  if(interaction.options.getString('song')) {
    const searches = await Client.songs.search(interaction.options.getString('song'));
    const searchLyrics = new MessageEmbed()
      .setTitle(`${queue.current.title} Lyrics`)
      .setDescription(`${await searches[0].lyrics()}`)
      .setColor('#38d65e')
      .setThumbnail(`${queue.current.thumbnail}`);
    
    await interaction.reply({ embeds: [searchLyrics] });
  }
  else {
    const searches = await Client.songs.search(queue.current.title);
    console.log(searches)
    const currentLyrics = new MessageEmbed()
      .setTitle(`${queue.current.title} Lyrics`)
      .setDescription(`${await searches[0].lyrics()}`)
      .setColor('#38d65e')
      .setThumbnail(`${queue.current.thumbnail}`);
    
    await interaction.reply({ embeds: [currentLyrics] });
  }
}

module.exports = {
  name: 'lyrics',
  description: 'Display the lyrics of the currently playing song or a specified song',
  perm: '',
  options: [
    {
      name: 'song',
      description: 'The song you want to get the lyrics of',
      type: 3,
      required: false
    }
  ],
  run
}