const maths = require('../maths');
const { calin } = require('../LocalStorage')
const Discord = require('discord.js')
const {i18n} = require('../i18n/i18n')
module.exports = {
	name: 'calin',
        category: "Interaction",
	execute(message, args) {
                if(args[0] === 'everyone' || message.mentions.everyone){
                        let member = message.member
                        let avatarmember = message.author.displayAvatarURL({ format: 'png' })
                        let GifEmbed = new Discord.MessageEmbed()
                                .setDescription(i18n.t('commands.interaction.calin.command',message.guildId,{user:message.author}))
                                .setImage(calin[maths.getRandomInt(0,calin.length)])
                                .setFooter({text: "Requested by " + member.displayName + ` (${member.user.tag})`, iconURL: avatarmember});
                        message.channel.send({embeds : [GifEmbed]})
                        message.delete()
                }
	}, 
};



