const Discord = require("discord.js");
const details = require("../../config.json").help;
const invalidSyntax = require("../functions/invalidSyntax");
module.exports = (message) => {
  let { content } = message;
  content = content.substring(6);
  let toOutput;

  if (content !== "") {
    //different commands config
    if (content == "rm") toOutput = details.rm;
    else if (content == "help") toOutput = details.help;
    else if (content == "countdown") toOutput = details.countdown;
    else {
      invalidSyntax(message, "No such command");
      return;
    }
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("00ffff")
        .setTitle(`Help for command "${content}"`)
        .setFooter("Code Runner!")
        .addField("Details", toOutput.details, true)
        .addField("Format", toOutput.format, true)
        .addField("Example", toOutput.example, true)
    );
  }

  //if its all
  else {
    let embed = new Discord.MessageEmbed()
      .setColor("00ffff")
      .setTitle(`Help`)
      .setFooter("Code Runner!")
      .setDescription("Run '!help COMMAND' for specific command help");
    let counter = 0;
    for (let i in details) {
      let toOutput;
      if (i == "rm") toOutput = details.rm;
      else if (i == "help") toOutput = details.help;
      embed.addField(i, toOutput.details, true);
      counter++;
    }
    message.channel.send(embed);
  }
};
