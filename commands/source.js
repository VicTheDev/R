const { MessageEmbed } = require("discord.js")
const fs = require('fs');
const path = require('path');
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));
module.exports = {
    name: "source",
    description: "Get source code of R2D2",
    category: "Other",
    use:"`!source` - Retourne le code source complet de R2D2\n`!source <command>` - Retourne le code source de la commande spécifiée",
    example:"`!source`\n`!source fight`",
    execute(message, args){
        let command = undefined
        if(args[0] != undefined){
            command = commandFiles.find(x=> x == `${args[0].toLowerCase()}.js`)
        }
        const endURL = command == undefined ? '' : `/blob/main/commands/${command}`
        const Embed = new MessageEmbed()
            .setDescription(`code source ${command==undefined ? 'R2D2' : `R2D2 pour la commande **${args[0].toLowerCase()}** :`} \n\nhttps://github.com/VicTheDev/R2D2${endURL}`)
            .setColor('BLUE');
        message.channel.send({embeds:[Embed]})
    }
}
//https://github.com/VicTheDev/R2D2/blob/main/commands/deflood.js