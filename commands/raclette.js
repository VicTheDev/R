const maths = require('../maths');
const { raclette } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'raclette',
	description: 'The best meal to share with your friends.',
	category: "Fun",
	execute(message, args) {
        const GifEmbed = new Discord.MessageEmbed()
            .setImage(raclette[maths.getRandomInt(0,raclette.length)]);
        message.channel.send({embeds : [GifEmbed]})
		message.delete()    
	}, 
};