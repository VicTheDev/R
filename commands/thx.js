const Discord = require('discord.js');
const maths = require('../maths');
const { thx } = require('../LocalStorage');
module.exports = {
	name: 'thx',
	description: "To thank te good guys",
	execute(message, args) {
        let member = message.member.displayName
        let user1 = message.mentions.members.first()
        if(user1 !== undefined){
                let target = user1.displayName
                let GifEmbed = new Discord.MessageEmbed()
                    .setImage(thx[maths.getRandomInt(0,thx.length)])
                    .setFooter(`Requested by ${message.member.displayName} (${message.author.tag})`, message.author.displayAvatarURL({ format: 'png' }))
                    .setDescription("**" + member + "** remercie **"+target+"**");
                    message.channel.send(GifEmbed)
        }  else{
            const ErrorApplaudEmbed = new Discord.MessageEmbed()
                .setColor("#ef5350")
                .setTitle("Commande Merci")
                .setDescription("Vous devez mentionnez un utilisateur pour utiliser cette interaction.\n\n**Usage**\n`!thx <target>`\n\n**Example Usage**\n`!thx @R2-D2`")
                .setFooter("Catégorie de commande: Interaction");
            message.channel.send(ErrorApplaudEmbed)

            }
    message.delete()
	}, 
};