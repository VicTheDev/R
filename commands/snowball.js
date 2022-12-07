const Discord = require('discord.js')
const maths = require('../maths')
const { snow } = require('../LocalStorage')

module.exports = {
    name: 'snowball',
    description: 'Throw a snowball to your oponent',
    category: "Interaction",
    use: "`!snowball <user>`",
    example: "`!snowball @R2-D2`",
    execute(message,args){
        const member = message.member
        const target = message.mentions.members.first()
        if(target !== undefined ){
            let ligne = ''
            if(member.displayName.length + target.displayName.length > 15){
                ligne = '\n'
            }
            args.shift()
            const SnowEmbed = new Discord.MessageEmbed()
                .setDescription('**'+member.displayName+`** lance une boule de neige sur ${ligne}**`+target.displayName+'** ')
                .setImage(snow[maths.getRandomInt(0,snow.length)])
                .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.avatarURL()});
            message.channel.send({embeds:[SnowEmbed]})
            message.delete()

        }else{
            const ErrorApplaudEmbed = new Discord.MessageEmbed()
                .setColor("#ef5350")
                .setTitle("Commande Boule de Neige")
                .setDescription("Vous devez mentionnez un utilisateur pour utiliser cette interaction.\n\n**Usage**\n`!snowball <target>`\n`!snowball <target>`\n\n**Example Usage**\n`!snowball @R2-D2`\n`!snowball @R2D2`")
                .setFooter({text: "Catégorie de commande: Interaction"});
            message.channel.send({embeds:[ErrorApplaudEmbed]})
            message.delete()
        }
        
    },
}