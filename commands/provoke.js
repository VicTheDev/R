const Discord = require('discord.js')
const maths = require('../maths')
const { duel } = require('../LocalStorage')
const {i18n} = require('../i18n/i18n')
const {ErrorEmbed} = require('../errorembed')

module.exports = {
    name: 'provoke',
    category: "Interaction",
    async execute(message,args){
        const guildId = message.guildId
        const member = message.member
        const target = message.mentions.members.first()

        if(target !== undefined ){
            args.shift()
            const DuelEmbed = new Discord.MessageEmbed()
                .setDescription(i18n.t("commands.interaction.provoke.text",guildId,{user:member.displayName,target:target.displayName,message:args.join(' ')}))
                .setImage(duel[maths.getRandomInt(0,duel.length)])
                .setFooter({text: "Requested by " + member.displayName + ` (${member.user.tag})`,iconURL: message.author.avatarURL()});
            message.channel.send({embeds: [DuelEmbed]})

        }else{
            const Embed = ErrorEmbed(this,guildId)
            message.channel.send({embeds: [Embed]})
        }
        message.delete()
    },
}