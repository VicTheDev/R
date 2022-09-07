const Discord = require('discord.js');
const maths = require('../maths');
const { piano } = require('../LocalStorage');
module.exports = {
    name: 'piano',
    description: 'The most majestic of instruments for the worst of people.',
    execute(message,args){
            let member = message.member.displayName
            let avatarmember = message.author.displayAvatarURL({ format: 'png' })
            let user1 = message.mentions.members.first()
            if(user1 !== undefined){
                    let target = user1.displayName
                    let GifEmbed = new Discord.MessageEmbed()
                        .setImage(piano[maths.getRandomInt(0,piano.length)])
                        .setFooter(`Requested by ${message.member.displayName} (${message.author.tag})`, message.author.displayAvatarURL({ format: 'png' }))
                        .setDescription("**" + member + "** lance un piano sur **"+target+"**");
                        message.channel.send(GifEmbed)
            }else{
                const ErrorApplaudEmbed = new Discord.MessageEmbed()
                    .setColor("#ef5350")
                    .setTitle("Commande Piano")
                    .setDescription("Vous devez mentionnez un utilisateur pour utiliser cette interaction.\n\n**Usage**\n`!piano <target>`\n\n**Example Usage**\n`!piano @R2-D2`")
                    .setFooter("Catégorie de commande: Interaction");
                message.channel.send(ErrorApplaudEmbed)
    
                }
            message.delete()
    },

};