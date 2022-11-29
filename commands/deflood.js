const Discord = require('discord.js');
const maths = require('../maths');
const { deflood } = require('../LocalStorage');
module.exports = {
	name: 'deflood',
	description: 'To stop the endless flow of messages that have no place here',
    category: "Interaction",
	execute(message, args) {
        if(args[0] === undefined){
            const GifEmbed = new Discord.MessageEmbed()
                .setDescription('**'+message.member.displayName+'** stoppe le flood')
                .setImage(deflood[maths.getRandomInt(0,deflood.length)]);
            message.channel.send({embeds : [GifEmbed]})        
        }else{
            const GifEmbed = new Discord.MessageEmbed()
                .setDescription('**'+message.member.displayName+'** stoppe le flood :\n'+args.join(' '))
                .setImage(deflood[maths.getRandomInt(0,deflood.length)]);
            message.channel.send({embeds : [GifEmbed]})
        }
        message.delete()
	}, 
};