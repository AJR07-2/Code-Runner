module.exports = (message, description) => {
    message.channel.send(
        new Discord.MessageEmbed()
            .setColor('ff0000')
            .setTitle('Invalid Syntax')
            .setFooter("Code Runner!")
            .setDescription(description)
    );
}