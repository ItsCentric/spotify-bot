const { default: axios } = require("axios");
const fs = require("fs")

const getFiles = (path, ending) => {
    return fs.readdirSync(path).filter(f=> f.endsWith(ending))
}

const getToken = async () => {
    const res = await axios({
        method: "POST",
        url: "https://accounts.spotify.com/api/token",
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
            "Authorization" : 'Basic ' + new Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64')
        },
        data: {
            grant_type: "client_credentials",
        }
    })
    return res.access_token
}

module.exports = {
    getFiles,
    getToken
}