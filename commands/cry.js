const maths = require('../maths');
const { cry } = require('../LocalStorage');
const Discord = require('discord.js')
const {i18n} = require('../i18n/i18n')
module.exports = {
    name: "cry",
    category: "Interaction",
    execute(message, args) {
        const guildId = message.guildId
        let member = message.member.displayName
        let avatarmember = message.author.displayAvatarURL({ format: 'png' })
        let GifEmbed = new Discord.MessageEmbed()
                .setDescription(i18n.t("commands.interaction.cry.command",guildId,{user:member}))
                .setImage(cry[maths.getRandomInt(0,cry.length)])
                .setFooter({text: "Requested by " + member, iconURL: avatarmember});
            message.channel.send({embeds : [GifEmbed]})
        message.delete()
    }
}