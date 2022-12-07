const maths = require('../maths');
const { tartiflette } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'tartiflette',
	description: 'Yum!',
	category: "Fun",
	use:"`!tartiflette`",
	example:"`!tartiflette`",
	execute(message, args) {
        const GifEmbed = new Discord.MessageEmbed()
            .setImage(tartiflette[maths.getRandomInt(0,tartiflette.length)]);
        message.channel.send({embeds : [GifEmbed]})   
		message.delete()     
	}, 
};