// * Library initialisation
const firebase = require("firebase");
const Discord = require("discord.js");
const token = require("../config.json");
const command = require("./commands");
const client = new Discord.Client();

// * Initialise firebase
var firebaseConfig = require('../config.json').firebase;
firebase.initializeApp(firebaseConfig);

// * Commands for discord bot
const rm = require("./commands/rm");
const help = require("./commands/help");
const countdown = require("./commands/countdown.js");
const kymchi = require("./commands/kymchi.js");

// * Initialise Discord bot
client.on("ready", () => {
  console.log("Client is ready");
  command(client, "rm", (message) => {
    rm(message);
  });

  command(client, "help", (message) => {
    help(message);
  });

  command(client, "countdown", (message) => {
    countdown(message);
  });

  command(client, "kymchi", (message) => {
    kymchi(message);
  });
});

//login
client.login(token.token);
