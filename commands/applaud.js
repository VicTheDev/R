const maths = require('../maths');
const { applaud } = require('../LocalStorage');
const Discord = require('discord.js')
module.exports = {
    name: "applaud",
    description: "When someone or something is so amazing that you want to congratulate them.",
    execute(message,args) {
        const member = message.member.displayName
        const avatarmember = message.author.displayAvatarURL({ format: 'png' })
        const user1 = message.mentions.members.first()
        const user2 = message.mentions.members.last()
        if(user1 !== undefined){
            const target = user1.displayName
            const GifEmbed = new Discord.MessageEmbed()
                .setImage(applaud[maths.getRandomInt(0,applaud.length)])
                .setFooter(`Requested by ${message.member.displayName} (${message.author.tag})`, message.author.displayAvatarURL({ format: 'png' }))
                .setDescription("**" + member + "** applaudit **"+target+"**");
            message.channel.send(GifEmbed)
            
        }   else{
                const content = args.join(' ')
                if(content.length > 0){
                    const GifEmbed = new Discord.MessageEmbed()
                        .setImage(applaud[maths.getRandomInt(0,applaud.length)])
                        .setFooter(`Requested by ${message.member.displayName} (${message.author.tag})`, message.author.displayAvatarURL({ format: 'png' }))
                        .setDescription("**" + member + "** applaudit **"+content+"**");
                    message.channel.send(GifEmbed)
                }else{
                    const ErrorApplaudEmbed = new Discord.MessageEmbed()
                        .setColor("#ef5350")
                        .setTitle("Commande Applaudir")
                        .setDescription("Vous devez mentionnez un utilisateur pour utiliser cette interaction.\n\n**Usage**\n`!applaud <target>`\n`!applaud <message>`\n\n**Example Usage**\n`!applaud @R2-D2`\n`!applaud les gens qui laissent la dernière part de pizza`")
                        .setFooter("Catégorie de commande: Interaction");
                    message.channel.send(ErrorApplaudEmbed)
                }
            }   
        message.delete()
    }
}