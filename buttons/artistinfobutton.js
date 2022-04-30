const { artistEmbeds } = require('../slashcommands/artistinfo');

var topTrackNumber = 0;
var currentPage = 0;
var currentSlashCommand;

module.exports = {
  name: "artistinfobutton",
  run: async (bot, interaction, parameters) => {
    console.log(artistEmbeds.slashCommandId)

    if (artistEmbeds.slashCommandId !== currentSlashCommand) {
      currentSlashCommand = artistEmbeds.slashCommandId;
      currentPage = 0;
      topTrackNumber = 0;
    }
    
    if (parameters[0] === 'next' && currentPage === 0) {
      interaction.update({ embeds: [artistEmbeds.artistTopTracks[0]] });
      currentPage++;
    }
    else if (parameters[0] === 'next' && currentPage !== 0) {
      topTrackNumber++;
      if (topTrackNumber > 2) {
        interaction.update({ embeds: [artistEmbeds.artistInfo] });
        topTrackNumber = 0;
        currentPage = 0;
      }
      else {
        interaction.update({ embeds: [artistEmbeds.artistTopTracks[topTrackNumber]] });
        currentPage++;
      }
    }
    
    if (parameters[0] === 'previous' && currentPage === 1) {
      interaction.update({ embeds: [artistEmbeds.artistInfo] });
      currentPage--;
    }
    else if (parameters[0] === 'previous' && currentPage !== 1 && currentPage !== 0) {
      topTrackNumber--;
      interaction.update({ embeds: [artistEmbeds.artistTopTracks[topTrackNumber]] })
      currentPage--;
    }
    else if (parameters[0] === 'previous' && currentPage !== 1 && currentPage === 0) {
      topTrackNumber = 2;
      interaction.update({ embeds: [artistEmbeds.artistTopTracks[topTrackNumber]] })
      currentPage = 3;
    }
  }
}