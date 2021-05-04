const Discord = require('discord.js');
const token = require('../config.json');
const command = require('./commands')
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Client is ready')


    /////////////////////
    //REMINDER
    /////////////////////
    command(client, 'rm', (message) => {
        let { content } = message;
        content = content.substring(4);
        let openCurly = false, closeCurly = false, openSquare = false, closeSquare = false, delay, reminder;

        //syntax checking and parsing of data
        for (let j = 0; j < content.length; j++) {
            let i = content.charAt(j);
            if (isAlphaNumeric(i)) continue;
            if (i === '{' && !openCurly) {
                openCurly = true;
            } else if (i === '}' && !closeCurly && openCurly) {
                delay = content.substring(content.indexOf("{"), content.indexOf("}"));
                closeCurly = true;
            } else if (i === '[' && !openSquare && openCurly && closeCurly) {
                openSquare = true;
            } else if (i === ']' && !closeSquare && openCurly && closeCurly && openSquare) {
                reminder = content.substring(content.indexOf("["), content.indexOf("]"));
                closeSquare = true;
            } else {
                console.log(openCurly, closeCurly, openSquare, closeSquare, "invalid syntax!");
                invalidSyntax(message, `Your syntax must match "!rm {time} [reminder]" and time must be in the format of (value)(specifier -> either s for seconds, m for minutes, h for hours, d for daily)`);
                return;
            }
        }

        if (!(openCurly && closeCurly && openSquare && closeSquare)) {
            console.log(openCurly, closeCurly, openSquare, closeSquare, "invalid syntax!");
            invalidSyntax(message, `Your syntax must match "!rm {time} [reminder]" and time must be in the format of (value)(specifier -> either s for seconds, m for minutes, h for hours, d for daily)`);
            return;
        }

        delay = delay.replace(/\W/g, '');
        reminder = reminder.replace(/\W/g, '');

        //parse delay in
        let lastInterval = 1, timedDelay = 0;
        
        try {
            if (checkOccurrences(delay, "s") <= 1 && checkOccurrences(delay, "m") <= 1 && checkOccurrences(delay, "h") <= 1 && checkOccurrences(delay, "d") <= 1) {
                for (let i of delay) {
                    if (i === 's') {
                        timedDelay += parseInt(delay.substring(lastInterval - 1, delay.indexOf("s")));
                        lastInterval = delay.indexOf("s");
                    } else if (i === 'm') {
                        timedDelay += parseInt(delay.substring(lastInterval - 1, delay.indexOf("m"))) * 60;
                        lastInterval = delay.indexOf("m");
                    } else if (i === 'h') {
                        timedDelay += parseInt(delay.substring(lastInterval - 1, delay.indexOf("h"))) * 60 * 60;
                        lastInterval = delay.indexOf("h");
                    } else if (i === 'd') {
                        timedDelay += parseInt(delay.substring(lastInterval - 1, delay.indexOf("d"))) * 60 * 60 * 24;
                        lastInterval = delay.indexOf("d");
                    }
                }
            } else {
                throw "ahhh";
            }
        } catch {
            invalidSyntax(message);
            console.log(delay, "invalid syntax! (delay)");
            return;
        }
        
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor('00ff00')
                .setTitle('Reminder successfully set')
                .setFooter("Code Runner!")
                .addField("Reminder", reminder, true)
                .addField("Time", `${timedDelay} seconds`, true)
        );

        //delay the sending of reminder
        setTimeout(() => {
            message.author.send(
                new Discord.MessageEmbed()
                    .setColor('0000ff')
                    .setTitle('Reminder')
                    .setFooter("Code Runner!")
                    .addField("Reminder", reminder, true)
                    .setDescription(`U asked to be reminded of this ${timedDelay} seconds ago`)
            );
        }, timedDelay*1000);
    })
})

//login
client.login(token.token);

//more functions
function isAlphaNumeric(str) {
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (code === 32) continue;
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
};

function checkOccurrences(string, substr) {
    return string.split(substr).length - 1
}

function invalidSyntax(message, description) {
    message.channel.send(
        new Discord.MessageEmbed()
            .setColor('ff0000')
            .setTitle('Invalid Syntax')
            .setFooter("Code Runner!")
            .setDescription(description)
    );
}