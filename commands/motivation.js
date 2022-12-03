const maths = require('../maths');
const { motivation } = require('../LocalStorage');
const Discord = require('discord.js')
module.exports = {
    name: "motivation",
    description: "JUST DO IT MABOI IF YOU DON'T TRY YOU'LL NEVER KNOW.",
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
                .setDescription("**" + member + "** envoie de la motivation à **"+target+"**");
            message.channel.send({embeds: [GifEmbed]})
            
        }   else{
                const content = args.join(' ')
                if(content.length > 0){
                    const GifEmbed = new Discord.MessageEmbed()
                        .setImage(motivation[maths.getRandomInt(0,motivation.length)])
                        .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.member.avatarURL()})
                        .setDescription("**" + member + "** envoie de la motivation **"+content+"**");
                    message.channel.send({embeds: [GifEmbed]})
                }else{
                    const ErrorMotivationEmbed = new Discord.MessageEmbed()
                        .setColor("#ef5350")
                        .setTitle("Commande Motivation")
                        .setDescription("Vous devez mentionnez un utilisateur pour utiliser cette interaction ou ajouter un message.\n\n**Usage**\n`!motivation <target>`\n`!motivation <message>`\n\n**Example Usage**\n`!motivation @R2-D2`\n`!motivation aux gens qui veulent réaliser leurs rêves`")
                        .setFooter({text: "Catégorie de commande: Interaction"});
                    message.channel.send({embeds: [ErrorMotivationEmbed]})
                }
            }   
        message.delete()
    }
}