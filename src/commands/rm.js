let isAlphaNumeric = require('../functions/isAlphaNumeric');
let invalidSyntax = require('../functions/invalidSyntax');
const Discord = require('discord.js');

module.exports = (message) => {
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
                //check if the delay is NaN
                if (isNaN(timedDelay)) {
                    throw "ah";
                }
            }
        } else {
            throw "ahhh";
        }
    } catch (error) {
        if (error === "ah") {
            invalidSyntax(message, `Your syntax must match "!rm {time} [reminder]" and time must be in the format of (value)(specifier -> either s for seconds, m for minutes, h for hours, d for daily)`);
        } else {
            invalidSyntax(message, "An unknown error occurred");
        }
        console.log(delay, "invalid syntax! (delay)", error);
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
    var date = new Date();
    var formattedDate = `(Date: ${date.getFullYear()}-${date.getMonth() + 1}, Time: ${date.getDate()}-${date.getHours()}h ${date.getMinutes()}m ${date.getSeconds()}s)`;
    setTimeout(() => {
        message.author.send(
            new Discord.MessageEmbed()
                .setColor('0000ff')
                .setTitle('Reminder')
                .setFooter("Code Runner!")
                .addField("Message", reminder, true)
                .setDescription(`U asked to be reminded at ${formattedDate}`)
        );
    }, timedDelay * 1000);
}

function checkOccurrences(string, substr) {
    return string.split(substr).length - 1
}