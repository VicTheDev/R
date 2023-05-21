const maths = require('../maths');
const { goodnight } = require('../LocalStorage');
const Discord = require('discord.js')
const {ErrorEmbed} = require('../errorembed')
const {i18n} = require('../i18n/i18n')
module.exports = {
    name: "goodnight",
    category: "Interaction",
    execute(message,args) {
        const guildId = message.guildId
        let member = message.member.displayName
        let avatarmember = message.author.displayAvatarURL({ format: 'png' })
        let user1 = message.mentions.members.first()
        if(user1 !== undefined){
                let target = user1.displayName
                let GifEmbed = new Discord.MessageEmbed()
                    .setImage(goodnight[maths.getRandomInt(0,goodnight.length)])
                    .setFooter({text: "Requested by " + member, iconURL: avatarmember})
                    .setDescription(i18n.t("commands.interaction.goodnight.text",guildId,{user:member,target:target}));
                    message.channel.send({embeds : [GifEmbed]})
        }else{        
            const ErrorApplaudEmbed = ErrorEmbed(this,guildId);
            message.channel.send({embeds: [ErrorApplaudEmbed]})
        }
    message.delete()
        
    }
}






