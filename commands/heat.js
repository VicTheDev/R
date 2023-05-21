const maths = require('../maths');
const { heat } = require('../LocalStorage')
const Discord = require('discord.js')
const {i18n} = require('../i18n/i18n')
module.exports = {
	name: 'heat',
	category: "Interaction",
	execute(message, args) {
		const guildId = message.guildId
        const GifEmbed = new Discord.MessageEmbed()
            .setDescription(i18n.t("commands.interaction.heat.text",guildId,{user:message.member.displayName}))
            .setImage(heat[maths.getRandomInt(0,heat.length)])
			.setFooter({text:`Requested by ${message.member.displayName} (${message.author.tag})`,iconURL: message.author.displayAvatarURL({ format: 'png' })});
        message.channel.send({embeds : [GifEmbed]})   
		message.delete()     
	}, 
};