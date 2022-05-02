const fs = require("fs");
const request = require("request");

const SPOTIFY_ENCODED_AUTH = process.env['SPOTIFY_ENCODED_AUTH'];

const getFiles = (path, ending) => {
    return fs.readdirSync(path).filter(f=> f.endsWith(ending))
}

const getToken = async (callback) => {
  var options = {
    'method': 'POST',
    'url': 'https://accounts.spotify.com/api/token',
    'headers': {
      'Authorization': 'Basic ' + SPOTIFY_ENCODED_AUTH,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': '__Host-device_id=AQCnO67e0Q8pWKz-39vObdzRb4thKLANWZd7-VB4Q7RoiY0obaL7LyI0Y7jXUIKOYkt-8TvOeGUt_yOmHtYTAPuC-0pKhlpYedk; sp_tr=false'
    },
    form: {
      'grant_type': 'client_credentials'
    },
    json: true
  };
  await request(options, (error, response, body, ) => {
    if (error) throw new Error(error);
    callback(body.access_token);
  });
}

const spotifySearch = async (q, type, limit, callback) => {
  getToken(async (token) => {
    var options = {
      "method": "GET",
      "url": `https://api.spotify.com/v1/search?q=${q}&type=${type}&limit=${limit}`,
      "headers": {
        "Authorization": `Bearer ${token}`
      },
      json: true
     };
    
    await request(options, (error, response) => {
      if(error) throw new Error(error);
      callback(response.body);
    });
  });
}

const roundTo = (n, digits) => {
  if (digits === undefined) {
    digits = 0;
  }

  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  var test =(Math.round(n) / multiplicator);
  return +(test.toFixed(digits));
}

const convertDuration = (duration, callback) => {
  const seconds = duration / 1000
  let durationSeconds = Math.round(seconds % 60);
  const durationMinutes = Math.round((seconds - durationSeconds) / 60)

  if (durationSeconds < 10) {
    durationSeconds = String(durationSeconds / 10);
    durationSeconds = durationSeconds[0] + durationSeconds[2]
  }
  let newDuration = `${durationMinutes}:${durationSeconds}`
  callback(newDuration)
}

module.exports = {
  getFiles,
  getToken,
  spotifySearch,
  roundTo,
  convertDuration
}