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

const DEBUG = false;

let formattedSong = "";
let songs = [];
let times = 0;

const tweet = (text, debug = true) => {
  if (debug) {
    console.log(text);
    return;
  }

  T.post("statuses/update", {
    status: text,
    function(err, data, response) {
      console.log(data);
    },
  });
};

const formatTitle = (song, from, to) => {
  return song.charAt(0).toUpperCase() + song.slice(from, to).toLowerCase();
};

const getTime = () => {
  const d = new Date();
  const hr = d.getHours();
  const min = d.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }

  return hr + ":" + (min < 10 ? "0" + min : min);
};

const app = () => {
  axios
    .get(URL)
    .then(({ data }) => {
      for (let song of data) {
        if (song.artist === "DANIEL BALAVOINE") {
          times += 1;
          if (song.title === "JE NE SUIS PAS UN HEROS C") {
            formattedSong = `"${formatTitle(song.title, 1, -2)}"`;
          } else {
            formattedSong = `"${formatTitle(song.title, 1)}"`;
          }
          songs.push(formattedSong);
        }
      }

      const uniqueSongs = songs.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      uniqueSongs.splice(uniqueSongs.length - 1, 0, "et");

      if (songs.length > 0) {
        tweet(
          `A ${getTime()}, Daniel Balavoine est passé ${times} fois sur radio Nostalgie ( @nostalgiefm )avec les chansons ${uniqueSongs.join(
            " "
          )}`,
          DEBUG
        );
      } else {
        tweet(
          `Aujourd'hui Daniel Balavoine n'est passé sur radio Nostalgie`,
          DEBUG
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

app();
