const maths = require('../maths');
const { cookie } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'cookie',
	description: 'A cookie, and life gets better',
	execute(message, args) {
        const GifEmbed = new Discord.MessageEmbed()
            .setImage(cookie[maths.getRandomInt(0,cookie.length)]);
        message.channel.send(GifEmbed)    
		message.delete()     
	}, 
};