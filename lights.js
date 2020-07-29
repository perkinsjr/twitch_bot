const Light = require("node-hue-api/lib/model/Light");
const v3 = require("node-hue-api").v3;
const LightState = require("node-hue-api").v3.lightStates.LightState;

require("dotenv").config();

// Tomato Red.
const SUBS = [255, 99, 71];
// Violet Red
const FOLLOWERS = [199, 21, 133];
// Blue
const BITS = [0, 0, 255];
// NEON GREEN
const DONATIONS = [57, 255, 20];
// BLINDING WHITE.
const DEFAULT = [255, 255, 255];
// Yellow
const HOST = [196, 218, 0];
const RAID = [255, 0, 255];
const PRIME_SUB_GIFT = [0, 102, 0];
const USERNAME = process.env.PHILIPS;

function hue_handler(type) {
  let state;

  switch (type) {
    case "subscription":
      state = new LightState().on().rgb(SUBS).alertLong();
      break;
    case "follow":
      state = new LightState().on().rgb(FOLLOWERS).alertLong();
      break;
    case "donation":
      state = new LightState().on().rgb(DONATIONS).alertLong();
      break;
    case "bits":
      state = new LightState().on().rgb(BITS).alertLong();
      break;
    case "random":
      state = new LightState().on().rgb(randomRGB()).alertLong();
      break;
    case "host":
      state = new LightState().on().rgb(HOST).alertLong();
      break;
    case "raid":
      state = new LightState().on().rgb(RAID).alertLong();
      break;
    case "prime_sub_gift":
      state = new LightState().on().rgb(PRIME_SUB_GIFT).alertLong();
      break;
    default:
      state = new LightState().on().rgb(DEFAULT).alertLong();
  }

  v3.discovery
    .nupnpSearch()
    .then((searchResults) => {
      const host_ip = searchResults[0].ipaddress;
      return v3.api.createLocal(host_ip).connect(USERNAME);
    })
    .then((api) => {
      api.lights.setLightState(25, state);
      api.lights.setLightState(26, state);
    })
    .catch((error) => {
      console.log(error);
    });
}

function randomRGB() {
  const randomNumber = Math.round(0xfffff * Math.random());
  const r = randomNumber >> 16;
  const g = (randomNumber >> 8) & 255;
  const b = randomNumber & 255;
  return [r, g, b];
}

module.exports = { hue_handler };
