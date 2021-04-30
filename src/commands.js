const { prefix } = require('../config.json');

module.exports = (client, aliases, callback) => { //pass in discord bot (to listen when someone sends message), aliases and callback (function u want ot run when someone runs a command)

    if (typeof aliases === "string") aliases = [aliases];

    client.on('message', (message) => { //message param
        const { content } = message; //de-structure

        aliases.forEach(alias => { //loop thru the loop we created above and check if an alias was ran
            const command = `${prefix}${alias}`;

            if (content.startsWith(`${command} ` || content == command)) { //check if the user's message is actually that command
                console.log(`Running command ${command}`);
                callback(message);
            }
        });
    })
}