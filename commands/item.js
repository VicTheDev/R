const {MessageEmbed} = require('discord.js')
const objects = require('../database/objects.json')
const {i18n} = require('../i18n/i18n')
const cardcommand = require('./card.js')
module.exports = {
	name: 'item',
	description: 'Get informations about an item.',
    category: "Inventory",
    use: '`!item <id>`\n`!item <itemName>`',
    example: "`!item 3`\n`!item pelle`",
	execute(message, args) {
        const guildId = message.guildId
        const item = i18n.i(args.join(' '),guildId)
        if(item!=undefined){
            if(item.card){
                cardcommand.execute(message,item.id,true)
            }else{
                const Embed = new MessageEmbed()
                .setTitle(item.name)
                .setDescription(`*${item.description}*${(item.use!=undefined ? `\n\n${item.use}` : '')}`)
                .setColor('DARK_ORANGE');
                Embed.description += item.saleable ? '\n\n**'+i18n.t("commands.inventory.item.sale",guildId)+'**' : '';
                Embed.footer = {text:`ID${i18n.t("highpunctuation",guildId)}: ${item.id}`}
                message.channel.send({embeds : [Embed]})
                message.delete()   
            }
        }else {
            message.reply({content: i18n.t("commands.inventory.item.notfound")})
        }
	}, 
};