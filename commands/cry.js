const maths = require('../maths');
const { cry } = require('../LocalStorage');
const Discord = require('discord.js')
module.exports = {
    name: "cry",
    description: "When you're reduced to tears.",
    category: "Interaction",
    use: "`!cry`",
    example: "`!cry`",
    execute(message, args) {
        let member = message.member.displayName
        let avatarmember = message.author.displayAvatarURL({ format: 'png' })
        let GifEmbed = new Discord.MessageEmbed()
                .setDescription("**" + member + "** pleure")
                .setImage(cry[maths.getRandomInt(0,cry.length)])
                .setFooter({text: "Requested by " + member, iconURL: avatarmember});
            message.channel.send({embeds : [GifEmbed]})
        message.delete()
    }
}