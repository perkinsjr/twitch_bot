const lights = require("./lights");
const io = require("socket.io-client");
const tmi = require("tmi.js");
const { timePatterns } = require("node-hue-api/lib/model");
require("dotenv").config();

let random30seconds = false;
const streamlabs = io.connect(
  `wss://sockets.streamlabs.com?token=${process.env.STREAMLABS}`
);

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: "jamesperkins",
    password: process.env.TOKEN,
  },
  channels: ["jamesperkins"],
});

client.connect();

client.on("connected", () => {
  console.log("Twitch Chat connected!");
});

streamlabs.on("connect", () => {
  console.log("Streamlabs Connected!");
});

streamlabs.on("event", (eventData) => {
  console.log(eventData.type);
  if (eventData.type === "donation") {
    lights.hue_handler("donation");
  } else if (eventData.type === "subscription") {
    lights.hue_handler("subscription");
  } else if (eventData.type === "follow") {
    lights.hue_handler("follow");
  } else if (eventData.type === "bits") {
    lights.hue_handler("bits");
  } else if (eventData.type === "host") {
    lights.hue_handler("host");
  } else if (eventData.type === "raid") {
    lights.hue_handler("raid");
  } else if (eventData.type === "prime_sub_gift") {
    lights.hue_handler("prime_sub_gift");
  }
});

client.on("message", (channel, tags, message, self) => {
  if (self) return;
  if (message.toLowerCase() === "!hello") {
    client.say(channel, `@${tags.username}, heya!`);
  }
  if (self) return;
  if (message.toLowerCase() === "!random" && random30seconds != true) {
    lights.hue_handler("random");
    random30seconds = true;
    setTimeout(goToSleep, 30000);
  }
  if (self) return;
  if (message.toLowerCase() === "!github") {
    client.say(channel, `@${tags.username}, https://github.com/perkinsjr`);
  }
  if (self) return;
  if (message.toLowerCase() === "!youtube") {
    client.say(
      channel,
      `@${tags.username}, https://youtube.com/jamesperkinsltc`
    );
  }
  if (self) return;
  if (message.toLowerCase() === "!twitter") {
    client.say(
      channel,
      `@${tags.username}, https://twitter.com/james_r_perkins`
    );
  }
  if (message.toLowerCase() === "!project") {
    console.log(channel.title);
    /* client.say(
            channel,
            `@${tags.username}, https://twitter.com/james_r_perkins`
        ); */
  }
  if (message.toLowerCase() === "!commands") {
    client.say(
      channel,
      `You can do the following commands:
        !random \n                                              
        !twitter  \n                                             
        !youtube    \n                                           
        !github       \n                                        
         `
    );
  }
  if (message.toLowerCase() === "!faq") {
    client.say(channel, `coming soon!`);
  }
});

function goToSleep() {
  random30seconds = false;
}
