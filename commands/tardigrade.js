const maths = require('../maths');
const { tardigrade } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'tardigrade',
	category: "Fun",
	execute(message, args) {
        const GifEmbed = new Discord.MessageEmbed()
            .setImage(tardigrade[maths.getRandomInt(0,tardigrade.length)]);
		message.channel.send({embeds : [GifEmbed]})
		message.delete()       
	}, 
};