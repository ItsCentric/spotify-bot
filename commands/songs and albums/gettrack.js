const { getToken } = require("../../util/functions");
const fetch = require("node-fetch");

module.exports = {
    name: "gettrack",
    category: "info",
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {
        let token = getToken();
        let id =  message.content.slice(9).trim()
        const result = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await result.json();
        message.reply("The name of the song you requested is: ${data.name}");
    }
}
// TODO: maybe try to fix this