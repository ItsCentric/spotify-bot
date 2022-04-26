const fs = require("fs");
const fetch = require("node-fetch");

// const SPOTIFY_CLIENT_ID = process.env['SPOTIFY_CLIENT_ID'];
// const SPOTIFY_CLIENT_SECRET = process.env['SPOTIFY_CLIENT_SECRET'];

const getFiles = (path, ending) => {
    return fs.readdirSync(path).filter(f=> f.endsWith(ending))
}

const getToken = async () => {
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
            "Authorization" : 'Basic ' + new Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64')
        },
        data: {
            grant_type: "client_credentials",
        }
    });

    const data = await res.json();
    return data.access_token
}

module.exports = {
    getFiles,
    getToken
}