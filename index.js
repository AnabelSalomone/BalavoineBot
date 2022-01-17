const Twit = require("twit");
const axios = require("axios");
require("dotenv").config();

const T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const URL = "https://www.nostalgie.fr/chansons-diffusees.json?yesterday=0";

let formattedSong = "";
let songs = [];
let times = 0;
let title = "";

const tweet = () => {
  axios
    .get(URL)
    .then(({ data }) => {
      for (let song of data) {
        if (song.artist === "DANIEL BALAVOINE") {
          times += 1;
          if (song.title === "JE NE SUIS PAS UN HEROS C") {
            formattedSong = title =
              song.title.charAt(0).toUpperCase() +
              song.title.slice(1, -2).toLowerCase();
          } else {
            title = formattedSong =
              song.title.charAt(0).toUpperCase() +
              song.title.slice(1).toLowerCase();
          }
          songs.push(formattedSong);
        }
      }

      const uniqueSongs = songs.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      uniqueSongs.splice(uniqueSongs.length - 1, 0, " et ");

      T.post("statuses/update", {
        status: `Aujourd'hui Daniel Balavoine est passé ${times} fois sur radio Nostalgie avec les chansons ${uniqueSongs.join(
          " "
        )}`,
        function(err, data, response) {
          console.log(data);
        },
      });

      console.log(uniqueSongs);
    })
    .catch((error) => {
      console.log(error);
    });
};

tweet();
