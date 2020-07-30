const Light = require("node-hue-api/lib/model/Light");
const v3 = require("node-hue-api").v3;
const { Control, CustomMode } = require("magic-home");
const LightState = require("node-hue-api").v3.lightStates.LightState;
require("dotenv").config();

const characteristics = {
  rgb_min_0: true,
  ww_min_0: true,
  set_color_magic_bytes: [0x00, 0x0f],
  wait_for_reply: false,
};
const light1 = new Control("10.0.0.42", characteristics);
const light2 = new Control("10.0.0.43", characteristics);
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
      magic_handler(SUBS);
      break;
    case "follow":
      state = new LightState().on().rgb(FOLLOWERS).alertLong();
      magic_handler(FOLLOWERS);
      break;
    case "donation":
      state = new LightState().on().rgb(DONATIONS).alertLong();
      magic_handler(DONATIONS);
      break;
    case "bits":
      state = new LightState().on().rgb(BITS).alertLong();
      magic_handler(BITS);
      break;
    case "random":
      state = new LightState().on().rgb(randomRGB()).alertLong();
      magic_handler(randomRGB());
      break;
    case "host":
      state = new LightState().on().rgb(HOST).alertLong();
      magic_handler(HOST);
      break;
    case "raid":
      state = new LightState().on().rgb(RAID).alertLong();
      magic_handler(RAID);
      break;
    case "prime_sub_gift":
      state = new LightState().on().rgb(PRIME_SUB_GIFT).alertLong();
      magic_handler(PRIME_SUB_GIFT);
      break;
    default:
      state = new LightState().on().rgb(DEFAULT).alertLong();
      magic_handler(DEFAULT);
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

function magic_handler(color) {
  let customeffect = new CustomMode();

  customeffect.addColor(color[0], color[1], color[2]);
  customeffect.addColor(color[0], color[1], color[2]);
  customeffect.addColor(color[0], color[1], color[2]);
  customeffect.addColor(color[0], color[1], color[2]);

  customeffect.setTransitionType("strobe");
  light1.setCustomPattern(customeffect, 5000);
  light2.setCustomPattern(customeffect, 5000);
  setTimeout(setLightToLastColor, 15000, color);
}

function setLightToLastColor(color) {
  light1.setColor(color[0], color[1], color[2]);
  light2.setColor(color[0], color[1], color[2]);
  console.log("waited");
}

module.exports = { hue_handler };
