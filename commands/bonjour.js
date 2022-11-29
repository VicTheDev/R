const maths = require('../maths');
const { hello } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'bonjour',
	description: "Hello, it's me, i was wondering if after all these years you'd like to meet.",
	category: "Interaction",
	execute(message, args) {
        const GifEmbed = new Discord.MessageEmbed()
            .setImage(hello[maths.getRandomInt(0,hello.length)]);
        message.channel.send({embeds : [GifEmbed]})      
		message.delete() 
	}, 
};