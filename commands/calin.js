const maths = require('../maths');
const { calin } = require('../LocalStorage')
const Discord = require('discord.js')
module.exports = {
	name: 'calin',
	description: 'To hug everyone',
        category: "Interaction",
        use: "`!calin eveyone`\n`!calin <users>`",
        example:"`!calin everyone`\n`!calin @everyone`\n`!calin @here`",
	execute(message, args) {
                if(args[0] === 'everyone' || message.mentions.everyone){
                        let member = message.member
                        let avatarmember = message.author.displayAvatarURL({ format: 'png' })
                        let GifEmbed = new Discord.MessageEmbed()
                                .setDescription("**" + member.displayName + "** fait un calin à **tout le monde**")
                                .setImage(calin[maths.getRandomInt(0,calin.length)])
                                .setFooter({text: "Requested by " + member.displayName + ` (${member.user.tag})`, iconURL: avatarmember});
                        message.channel.send({embeds : [GifEmbed]})
                        message.delete()
                }
	}, 
};



