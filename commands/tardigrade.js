const maths = require('../maths');
const { tardigrade } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'tardigrade',
	description: 'The strongest animal.',
	category: "Fun",
	execute(message, args) {
        const GifEmbed = new Discord.MessageEmbed()
            .setImage(tardigrade[maths.getRandomInt(0,tardigrade.length)]);
		message.channel.send({embeds : [GifEmbed]})
		message.delete()       
	}, 
};