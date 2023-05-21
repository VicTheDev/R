const {MessageEmbed} = require('discord.js');
const cards = require('../database/cards.json')
const {i18n} = require('../i18n/i18n')
module.exports = {
    name:"card",
    category:"Inventory",
    execute(message, args,full){
        const guildId = message.guildId;
        const arr = new Array
        arr.push(args)
        args = typeof args == 'object' ? args : arr
        let card = i18n.i(args.join(' '),guildId);
        Object.assign(card,cards.find(x => x.id==card.id))
        if(card == undefined){
            message.reply(i18n.t("commands.inventory.card.notfound",guildId))
        }else{
            displayCard(message, card, full)
        }

        function displayCard(message, card,full){
            const cardFull = new MessageEmbed()
                .setImage(card.image)
                .setFooter({text:`ID${i18n.t("highpunctuation",guildId)}: ${card.id} | ${card.name}`})
            const cardDetails = new MessageEmbed()
                .setThumbnail(card.image)
                //.setImage(card.image)
                .setTitle(card.name)
                .setDescription(`${card.description}\n${(card.use==undefined ? '' : `**${card.use}**`)}\n`)
                .setFooter({text:`ID${i18n.t("highpunctuation",guildId)}: ${card.id}`})
                .setColor('821EDA');
            cardDetails.description += `**Mana${i18n.t("highpunctuation",guildId)}**: \`${card.mana}\``;
            message.channel.send({embeds: [full == undefined ? cardFull : cardDetails]})
        }
    }
}