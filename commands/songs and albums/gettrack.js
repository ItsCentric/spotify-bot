// const { getToken } = require("../../util/functions")
// const { default: axios } = require("axios");

// module.exports = {
//     name: "gettrack",
//     category: "info",
//     permissions: [],
//     devOnly: false,
//     run: async ({client, message, args}) => {
//         let token = getToken();
//         let id =  message.content.slice(9).trim()
//         const result = await axios(`https://api.spotify.com/v1/tracks/${id}`, {
//             method: "GET",
//             headers: { "Authorization": "Bearer " + token }
//         })

//         console.log(result.album.name)
//     }
// }

// yeah = getToken();
// yeah;
// TODO: maybe try to fix this