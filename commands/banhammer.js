const Discord = require('discord.js');
const maths = require('../maths');
const { banhammer } = require('../LocalStorage');
module.exports = {
	name: 'banhammer',
	description: "The Admin's power to summon throw the banhammer on the fools",
    category: "Interaction",
	execute(message, args) {
        let member = message.member.displayName
        let avatarmember = message.author.displayAvatarURL({ format: 'png' })
        let user1 = message.mentions.members.first()
        let user2 = message.mentions.members.last()
        if(user1 !== undefined){

            if(user2 !== user1 && user2 !==member){
                let user = user1.displayName
                let target = user2.displayName
                let GifEmbed = new Discord.MessageEmbed()
                    .setImage(banhammer[maths.getRandomInt(0,banhammer.length)])
                    .setFooter({name: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })})
                    .setDescription("**" + user + "** envoie le Ban Hammer sur **"+target+"**");
                    message.channel.send({embeds: [GifEmbed]})

            }   else{
                let target = user1.displayName
                let GifEmbed = new Discord.MessageEmbed()
                    .setImage(banhammer[maths.getRandomInt(0,banhammer.length)])
                    .setFooter({name: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })})
                    .setDescription("**" + member + "** envoie le Ban Hammer sur **"+target+"**");
                    message.channel.send({embeds: [GifEmbed]})
            }
        }   else{
            const ErrorApplaudEmbed = new Discord.MessageEmbed()
                .setColor("#ef5350")
                .setTitle("Commande BanHammer")
                .setDescription("Vous devez mentionnez un utilisateur pour utiliser cette interaction.\n\n**Usage**\n`!banhammer <target>`\n\n**Example Usage**\n`!banhammer @R2-D2`")
                .setFooter({name: "Catégorie de commande: Interaction"});
            message.channel.send({embeds: [ErrorApplaudEmbed]})

            }
        message.delete()
	}, 
};