const { MessageEmbed } = require("discord.js")
const fs = require('fs');
const path = require('path');
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));
const {i18n} = require('../i18n/i18n')

module.exports = {
    name: "source",
    category: "Utility",
    execute(message, args){
        const guildId = message.guildId
        let command = undefined
        if(args[0] != undefined){
            command = commandFiles.find(x=> x == `${args[0].toLowerCase()}.js`)
        }
        const endURL = command == undefined ? '' : `/blob/main/commands/${command}`
        const Embed = new MessageEmbed()
            .setDescription(i18n.t("commands.utility.source.source",guildId,{command:(command==undefined ? 'R2-D2' : i18n.t("commands.utility.source.command",guildId,{command:args[0].toLowerCase()})), endURL:endURL}))
            .setColor('BLUE');
        message.channel.send({embeds:[Embed]})
    }
}