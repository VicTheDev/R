const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const cards = require('../database/cards.json');
const { getRandomInt, removeItem } = require('../maths');
const mongoose = require('../database/mongoose');
const show = require('./card.js')
const wait = require('util').promisify(setTimeout)
const {i18n} = require('../i18n/i18n')
module.exports = {
    name:'booster',
    category:'Inventory',
    async execute(message, args){
        const guildId = message.guildId
        let user = message.author
        const element = await mongoose.Inventory.findOne({ user: user.id});
        let inventory = element.inventory.toObject()
        if(element != undefined){
            const nBoosters = inventory.filter(x => x==10).length
            let Embed = new MessageEmbed()
                .setDescription(i18n.t("commands.inventory.booster.display",guildId,{nboosters:nBoosters}))
                .setColor('DARK_GOLD');
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('1')
                        .setLabel(i18n.t("commands.inventory.booster.buttons.one",guildId))
                        .setStyle('SUCCESS')
                        .setDisabled(!Boolean(nBoosters)),
                    new MessageButton()
                        .setCustomId('all')
                        .setLabel(i18n.t("commands.inventory.booster.buttons.all",guildId))
                        .setStyle('PRIMARY')
                        .setDisabled(!Boolean(nBoosters)),
                    new MessageButton()
                        .setCustomId('cancel')
                        .setLabel(i18n.t("commands.inventory.booster.buttons.cancel",guildId))
                        .setStyle('DANGER')
                )
            message.delete()
            const botmessage = await message.channel.send({embeds:[Embed], components: [row]})

            const filter = i => ['1','all','cancel'].includes(i.customId) || i.member.user.id == message.author.id || i.message.channel == message.channel;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 30_000})
                    
            let fullfilled = false
            collector.on('collect', async i => {
                switch (i.customId){
                    case '1':
                        fullfilled = true;
                        collector.stop()
                        Embed.description = i18n.t("commands.inventory.booster.opening",guildId,{n:'1',plural:''})
                        await botmessage.edit({embeds:[Embed], components:[]})
                        const cardwon = cards[getRandomInt(0,cards.length)]
                        await inventory.splice(inventory.indexOf(10), 1, cardwon.id)
                        await wait(2500)
                        await mongoose.Inventory.findOneAndUpdate(
                            { user: user.id},
                            { $set: { inventory: inventory}}
                        )
                        Embed.description = i18n.t("commands.inventory.booster.unpacked",guildId,{card:cardwon.name})
                        await botmessage.edit({embeds:[Embed]})
                        show.execute(botmessage,[cardwon.id])
                        break;
                    case 'all':
                        fullfilled = true;
                        collector.stop()
                        Embed.description = i18n.t("commands.inventory.booster.opening",guildId,{n:nBoosters,plural:'s'})
                        await botmessage.edit({embeds:[Embed], components:[]})
                        let cardswon = []
                        let cardswonid = []
                        for (let x = 0; x < nBoosters; x++) {
                            cardswon.push(cards[getRandomInt(0,cards.length)])
                            cardswonid.push(cardswon[x].id)
                        }
                        inventory = removeItem(inventory,10)
                        const inventoryUpdatedAll = inventory.concat(cardswonid)
                        let cardswoniterable = []
                        while (cardswon.length>0){
                            cardswoniterable.push([cardswon[0],cardswon.filter(x => x==cardswon[0]).length]) // push in cardswoniterable an array with arr[0]=cardX and arr[1]=number of occurences of cardX in cardswon
                            cardswon = removeItem(cardswon,cardswon[0])
                        }
                        let Description = i18n.t("commands.inventory.booster.unpackedmany.found",guildId)
                        for(i in cardswoniterable){
                            if(i<cardswoniterable.length-1){
                                Description += ` ${cardswoniterable[i][1]}x **${cardswoniterable[i][0].name}**,`
                            }else{
                                Description += ` ${i18n.t("commands.inventory.booster.unpackedmany.and",guildId)} ${cardswoniterable[i][1]}x **${cardswoniterable[i][0].name}**${i18n.t("highpunctuation",guildId)}!`
                            }
                        }
                        Embed.description = Description
                        await wait(3000);
                        await mongoose.Inventory.findOneAndUpdate(
                            { user: user.id},
                            { $set: { inventory: inventoryUpdatedAll}}
                        )
                        await botmessage.edit({embeds:[Embed]})
                        break;
                    case 'cancel':
                        collector.stop()
                        break;
                }
            })

            collector.on('end', async collected => {
                if(!fullfilled){
                    botmessage.delete()
                }
            })
        }else{
            message.reply(i18n.t("commands.inventory.inventorymissing",guildId))
        }
    }
}