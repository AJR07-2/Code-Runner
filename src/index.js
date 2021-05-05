const Discord = require('discord.js');
const token = require('../config.json');
const command = require('./commands')
const client = new Discord.Client();

//commands
const rm = require('./commands/rm');
const help = require('./commands/help');

client.on('ready', () => {
    console.log('Client is ready')
    command(client, 'rm', (message) => {
        rm(message);
    })

    command(client, 'help', (message) => {
        help(message);
    })
})

//login
client.login(token.token);

//more functions