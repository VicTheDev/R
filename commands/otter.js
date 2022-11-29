const maths = require('../maths');
const { ottergif } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'otter',
	description: 'Otters are so cuuute!',
	category: "Fun",
	execute(message, args) {
        const GifEmbed = new Discord.MessageEmbed()
            .setImage(ottergif[maths.getRandomInt(0,ottergif.length)]);
        message.channel.send({embeds : [GifEmbed]})       
		message.delete()
	}, 
};