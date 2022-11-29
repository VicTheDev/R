const maths = require('../maths');
const { goodnight } = require('../LocalStorage');
const Discord = require('discord.js')
module.exports = {
    name: "goodnight",
    description: "Hope you'll sleep well",
    category: "Interaction",
    execute(message,args) {
        let member = message.member.displayName
        let avatarmember = message.author.displayAvatarURL({ format: 'png' })
        let user1 = message.mentions.members.first()
        let user2 = message.mentions.members.last()
        if(user1 !== undefined){
                let target = user1.displayName
                let GifEmbed = new Discord.MessageEmbed()
                    .setImage(goodnight[maths.getRandomInt(0,goodnight.length)])
                    .setFooter({name: "Requested by " + member, iconURL: avatarmember})
                    .setDescription("**" + member + "** souhaite bonne nuit à **"+target+"**");
                    message.channel.send({embeds : [GifEmbed]})
        }   else{
            const ErrorApplaudEmbed = new Discord.MessageEmbed()
                .setColor("#ef5350")
                .setTitle("Commande Bonne nuit")
                .setDescription("Vous devez mentionnez un utilisateur pour utiliser cette interaction.\n\n**Usage**\n`!goodnight <target>`\n\n**Example Usage**\n`!goodnight @R2-D2`")
                .setFooter({name: "Catégorie de commande: Interaction"});
            message.channel.send({embeds: [ErrorApplaudEmbed]})

            }
    message.delete()
        
    }
}






