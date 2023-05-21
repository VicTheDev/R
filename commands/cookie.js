const maths = require('../maths');
const { cookie } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'cookie',
	category: "Fun",
	execute(message, args) {
        const GifEmbed = new Discord.MessageEmbed()
            .setImage(cookie[maths.getRandomInt(0,cookie.length)]);
        message.channel.send({embeds : [GifEmbed]})  
		message.delete()     
	}, 
};