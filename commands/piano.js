const Discord = require('discord.js');
const maths = require('../maths');
const { piano } = require('../LocalStorage');
const {i18n} = require('../i18n/i18n')
const {ErrorEmbed} = require('../errorembed')
module.exports = {
    name: 'piano',
    category: "Interaction",
    execute(message,args){
        const guildId = message.guildId
        let member = message.member.displayName
        let user1 = message.mentions.members.first()
        if(user1 !== undefined){
            let target = user1.displayName
            let GifEmbed = new Discord.MessageEmbed()
                .setImage(piano[maths.getRandomInt(0,piano.length)])
                .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.avatarURL()})
                .setDescription(i18n.t("commands.interaction.piano.text",guildId,{user:member,target,target}));
                message.channel.send({embeds:[GifEmbed]})
        }else{
            message.channel.send({embeds:[ErrorEmbed(this,guildId)]})

            }
        message.delete()
    }
};