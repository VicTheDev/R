const maths = require('../maths');
const { motivation } = require('../LocalStorage');
const Discord = require('discord.js')
const {i18n} = require('../i18n/i18n')
const {ErrorEmbed} = require('../errorembed')
module.exports = {
    name: "motivation",
    category: "Interaction",
    execute(message,args) {
        const member = message.member.displayName
        const avatarmember = message.author.displayAvatarURL({ format: 'png' })
        const user1 = message.mentions.members.first()
        if(user1 !== undefined){
            const target = user1.displayName
            const GifEmbed = new Discord.MessageEmbed()
                .setImage(motivation[maths.getRandomInt(0,motivation.length)])
                .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.member.avatarURL()})
                .setDescription(i18n.t("commands.interaction.motivation.text",guildId,{member,target}));
            message.channel.send({embeds: [GifEmbed]})
            
        }   else{
                const content = args.join(' ')
                if(content.length > 0){
                    const GifEmbed = new Discord.MessageEmbed()
                        .setImage(motivation[maths.getRandomInt(0,motivation.length)])
                        .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.avatarURL()})
                        .setDescription(i18n.t("commands.interaction.motivation.text",guildId,{member,target}));
                    message.channel.send({embeds: [GifEmbed]})
                }else{
                    const ErrorMotivationEmbed = ErrorEmbed(this,guildId)
                    message.channel.send({embeds: [ErrorMotivationEmbed]})
                }
            }   
        message.delete()
    }
}