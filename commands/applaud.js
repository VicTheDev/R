const maths = require('../maths');
const { applaud } = require('../LocalStorage');
const Discord = require('discord.js')
const {i18n} = require('../i18n/i18n')
const {PREFIX} = require('../config.json')
module.exports = {
    name: "applaud",
    description: "When someone or something is so amazing that you want to congratulate them.",
    category: "Interaction",
    use: "`!applaud <user>` - Applaudit l'utilisateur mentionné\n`!applaud <message>` - Applaudit le contenu du message",
    example:"`!applaud @R2-D2`\n`!applaud les gens qui laissent la dernière part de pizza`",
    execute(message,args) {
        const member = message.member.displayName
        const avatarmember = message.author.displayAvatarURL({ format: 'png' })
        const user1 = message.mentions.members.first()
        const user2 = message.mentions.members.last()
        const guildId = message.guildId
        if(user1 !== undefined){
            const target = user1.displayName
            const GifEmbed = new Discord.MessageEmbed()
                .setImage(applaud[maths.getRandomInt(0,applaud.length)])
                .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })})
                .setDescription(`**${member}** ${i18n.t("commands.interaction.applaud.command")} **${target}**`);
            message.channel.send({embeds: [GifEmbed]})
            
        }   else{
                const content = args.join(' ')
                if(content.length > 0){
                    const GifEmbed = new Discord.MessageEmbed()
                        .setImage(applaud[maths.getRandomInt(0,applaud.length)])
                        .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })})
                        .setDescription(`**${member}** ${i18n.t("commands.interaction.applaud.command")} **${content}**`);
                    message.channel.send({embeds: [GifEmbed]})
                }else{
                    const ErrorApplaudEmbed = new Discord.MessageEmbed()
                        .setColor("#ef5350")
                        .setTitle(`${i18n.t("commands.utility.help.command",guildId)}: ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`)
                        .setDescription(`${i18n.t("commands.interaction.mentionmissing",guildId)}\n\nUsage\n${i18n.t("commands.interaction.applaud.use",guildId,{prefix:PREFIX})}\n\nExamples\n${i18n.t("commands.interaction.applaud.example",guildId,{prefix:PREFIX})}`)
                        .setFooter({text: `${i18n.t("commands.utility.help.commandcategory",guildId)}: ${this.category}`});
                    message.channel.send({embeds: [ErrorApplaudEmbed]})
                }
            }   
        message.delete()
    }
}