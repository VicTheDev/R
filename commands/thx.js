const Discord = require('discord.js');
const maths = require('../maths');
const { thx } = require('../LocalStorage');
const {ErrorEmbed} = require('../errorembed')
const {i18n} = require('../i18n/i18n')
module.exports = {
	name: 'thx',
    category: "Interaction",
	execute(message, args) {
        const guildId = message.guildId
        let member = message.member.displayName
        let user1 = message.mentions.members.first()
        if(user1 !== undefined){
                let target = user1.displayName
                let GifEmbed = new Discord.MessageEmbed()
                    .setImage(thx[maths.getRandomInt(0,thx.length)])
                    .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.avatarURL()})
                    .setDescription(i18n.t("commands.interaction.thx.thanks",guildId,{member:member,target:target}));
                    message.channel.send({embeds : [GifEmbed]})
        }  else{
            const ErrorApplaudEmbed = ErrorEmbed(this,guildId)
            message.channel.send({embeds : [ErrorApplaudEmbed]})

            }
    message.delete()
	}, 
};