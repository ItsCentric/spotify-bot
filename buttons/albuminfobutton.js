const { albumEmbeds } = require('../slashcommands/albuminfo.js');

var currentPage = 0;
var currentSlashCommand;

module.exports = {
  name: 'albuminfobutton',
  run: async (bot, interaction, parameters) => {
    // if the current cached artistinfo slash command doesnt match the most recent one, reset the currentPage variable 
    if (albumEmbeds.slashCommandId !== currentSlashCommand) {
      currentSlashCommand = albumEmbeds.slashCommandId;
      currentPage = 0;
    }
    
    if (parameters[0] === 'next' && currentPage === 0) {
      interaction.update({ embeds: [albumEmbeds.albumTracks] });
      currentPage++;
    }
    else if (parameters[0] === 'next' && currentPage !== 0) {
      interaction.update({ embeds: [albumEmbeds.albumInfo] });
      currentPage--;
    }

    if (parameters[0] === 'previous' && currentPage === 0) {
      interaction.update({ embeds: [albumEmbeds.albumTracks] });
      currentPage++;
    }
    else if (parameters[0] === 'previous' && currentPage !== 0) {
      interaction.update({ embeds: [albumEmbeds.albumInfo] });
      currentPage--;
    }
  }
}