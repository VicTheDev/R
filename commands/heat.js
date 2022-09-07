const maths = require('../maths');
const { heat } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'heat',
	description: 'Nothing is better than heat near a fireplace',
	execute(message, args) {
        const GifEmbed = new Discord.MessageEmbed()
            .setDescription(`**${message.member.displayName}** se réchauffe près de la cheminée`)
            .setImage(heat[maths.getRandomInt(0,heat.length)])
			.setFooter(`Requested by ${message.member.displayName} (${message.author.tag})`, message.author.displayAvatarURL({ format: 'png' }));
        message.channel.send(GifEmbed)    
		message.delete()     
	}, 
};