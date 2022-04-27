const { getToken } = require("../../util/functions");
const request = require("request");

module.exports = {
    name: "gettrack",
    category: "info",
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {
      getToken((result) => {
        let id =  message.content.slice(9).trim()
        
        var options = {
          'method': 'GET',
          'url': `https://api.spotify.com/v1/tracks/${id}`,
          'headers': {
            'Authorization': `Bearer ${result}`
          },
          json: true
        };
        request(options, (error, response, body) => {
          if (error) throw new Error(error);
          message.reply(`The name of the song you requested is: ${body.name}`);
        });
      });
    }
}