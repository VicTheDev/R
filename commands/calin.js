const maths = require('../maths');
const { calin } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'calin',
	description: 'To hug everyone',
	execute(message, args) {
                if(args[0] === 'everyone' || message.mentions.last === "everyone"){
                        let member = message.member
                        let avatarmember = message.author.displayAvatarURL({ format: 'png' })
                        let GifEmbed = new Discord.MessageEmbed()
                                .setDescription("**" + member.displayName + "** fait un calin à **tout le monde**")
                                .setImage(calin[maths.getRandomInt(0,calin.length)])
                                .setFooter("Requested by " + member.displayName + ` (${member.user.tag})`, avatarmember);
                        message.channel.send(GifEmbed)
                        message.delete()
                }
	}, 
};



