const Discord = require('discord.js');
const maths = require('../maths');
const { banhammer } = require('../LocalStorage');
const {i18n} = require('../i18n/i18n')
const {PREFIX} = require('../config.json')

module.exports = {
	name: 'banhammer',
    category: "Interaction",
	execute(message, args) {
        let member = message.member.displayName
        let user1 = message.mentions.members.first()
        let user2 = message.mentions.members.last()
        const guildId = message.guildId
        if(user1 !== undefined){

            if(user2 !== user1 && user2 !==member){
                let user = user1.displayName
                let target = user2.displayName
                let GifEmbed = new Discord.MessageEmbed()
                    .setImage(banhammer[maths.getRandomInt(0,banhammer.length)])
                    .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })})
                    .setDescription(i18n.t("commands.interaction.banhammer.command",guildId,{user:user,target,target}));
                    message.channel.send({embeds: [GifEmbed]})

            }else{
                let target = user1.displayName
                let GifEmbed = new Discord.MessageEmbed()
                    .setImage(banhammer[maths.getRandomInt(0,banhammer.length)])
                    .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })})
                    .setDescription(i18n.t("commands.interaction.banhammer.command", guildId, {user:member,target:target}));
                    message.channel.send({embeds: [GifEmbed]})
            }
        }else{
            const ErrorApplaudEmbed = new Discord.MessageEmbed()
                .setColor("#ef5350")
                .setTitle(`${i18n.t("commands.utility.help.command",guildId)}: ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`)
                .setDescription(`${i18n.t("commands.interaction.mentionmissing",guildId)}\n\nUsage\n${i18n.t("commands.interaction.banhammer.use",guildId,{prefix:PREFIX})}\n\nExamples\n${i18n.t("commands.interaction.banhammer.example",guildId,{prefix:PREFIX})}`)
                .setFooter({text: `${i18n.t("commands.utility.help.commandcategory",guildId)}: ${this.category}`});
            message.channel.send({embeds: [ErrorApplaudEmbed]})

            }
        message.delete()
	}, 
};