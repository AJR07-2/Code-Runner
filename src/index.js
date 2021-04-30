const Discord = require('discord.js');
const token = require('../config.json');
const command = require('./commands')
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Client is ready')

    command(client, 'test', (message) => {
        message.channel.send("hi");
    })
})

client.login(token.token);