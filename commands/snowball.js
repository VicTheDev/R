const Discord = require('discord.js')
const maths = require('../maths')
const { snow } = require('../LocalStorage')
const {i18n} = require('../i18n/i18n')
const {ErrorEmbed} = require('../errorembed')

module.exports = {
    name: 'snowball',
    category: "Interaction",
    execute(message,args){
        const guildId = message.guildId
        const member = message.member
        const target = message.mentions.members.first()
        if(target !== undefined ){
            let ligne = ''
            if(member.displayName.length + target.displayName.length > 15){
                ligne = '\n'
            }
            args.shift()
            const SnowEmbed = new Discord.MessageEmbed()
                .setDescription(i18n.t("commands.interaction.snowball.text",guildId,{user:member.displayName,break:ligne,target:target.displayName}))
                .setImage(snow[maths.getRandomInt(0,snow.length)])
                .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.avatarURL()});
            message.channel.send({embeds:[SnowEmbed]})
            message.delete()

        }else{
            const Embed = ErrorEmbed(this,guildId)
            message.channel.send({embeds:[Embed]})
            message.delete()
        }
        
    },
}