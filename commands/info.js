const Discord = require('discord.js')
const fs = require('fs');
const path = require('path');
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));
const package = require('../package.json');
const {i18n} = require('../i18n/i18n')
module.exports = {
    name: 'info',
    category: "Utility",
    execute(message,args){
        const guildId = message.guildId
        const InfoEmbed = new Discord.MessageEmbed()
            .setTitle(i18n.t("commands.utility.info.title",guildId))
            .setDescription(i18n.t("commands.utility.info.text",guildId))
            .setThumbnail('https://icons.iconarchive.com/icons/creativeflip/starwars-longshadow-flat/256/R2D2-icon.png')
            .setColor("#4172bf")
            .setFields([
                {name: i18n.t("commands.utility.info.commands",guildId), value: `${commandFiles.length}`, inline: true},
                {name: i18n.t("commands.utility.info.lines",guildId), value:'4967', inline: true}
            ])
            .setFooter({text:i18n.t("commands.utility.info.version",guildId,{version:package.version})});
        message.channel.send({embeds: [InfoEmbed]})
        message.delete()
    },
}