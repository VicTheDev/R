const {MessageEmbed} = require('discord.js')
const {i18n} = require('../i18n/i18n')

module.exports = {
    name:"ping",
    category:"Utility",
    execute(message,args){
        const guildId = message.guildId
        const ts = message.createdTimestamp
        const Embed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(i18n.t("commands.utility.ping.text",guildId,{ping:Date.now()-ts}));
        message.reply({embeds:[Embed]})
        
    }
}