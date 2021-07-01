const Discord = require("discord.js");
const invalidSyntax = require("../functions/invalidSyntax");
module.exports = async (message) => {
  let { content } = message;
  content = content.substring(1);
  let arr = content.split(" "),
    time = 0,
    countdownMessage = "";

  if (arr.length >= 5) {
    time +=
      parseInt(arr[1]) * 60 * 60 + parseInt(arr[2]) * 60 + parseInt(arr[3]);
    for (let i = 4; i < arr.length; i++) countdownMessage += arr[i] + " ";
    if (isNaN(time)) {
      invalidSyntax(
        message,
        "Please provide date first then time, check help for more info"
      );
      return;
    }

    let sent = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor("00ffff")
        .setTitle(`Countdown set`)
        .setFooter("Code Runner!")
        .addField("Initalizing...", "Waiting...", true)
        .addField("Message", countdownMessage, true)
    );
    
    startCountdown(time + 5, sent, countdownMessage, message);
  } else {
    invalidSyntax(
      message,
      "Please provide date first then time, check help for more info"
    );
  }
};

function parseSeconds(time) {
  let seconds = time % 60;
  time -= seconds;
  let minutes = (time % 3660) / 60;
  time -= minutes * 60;
  let hours = time / 3660;
  return [seconds, minutes, hours];
}

function startCountdown(time, message, countdownMessage, authorMessage) {
  time-=5;
  let [seconds, minutes, hours] = parseSeconds(time),
    colour = "0000ff";
  if (time <= 0) {
    message.channel.send(
      "<@" + authorMessage.author.id + "> " + `Countdown "${countdownMessage}" is over!`
    );
    message.edit(
      new Discord.MessageEmbed()
      .setColor(colour)
      .setTitle(`Countdown Over`)
      .setFooter("Code Runner!")
    )
    return;
  }

  if (time < 20) colour = "ff0000";

  message.edit(
    new Discord.MessageEmbed()
      .setColor(colour)
      .setTitle(`Countdown set`)
      .setFooter("Code Runner!")
      .addField("Time Left", `${hours}:${minutes}:${seconds}`, true)
      .addField("Message", countdownMessage, true)
  );
  setTimeout(() => {
    startCountdown(time, message, countdownMessage, authorMessage);
  }, 5000);
}
