const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const cards = require('../database/cards.json');
const { getRandomInt, removeItem } = require('../maths');
const mongoose = require('../database/mongoose');
const show = require('./card.js')
const wait = require('util').promisify(setTimeout)
module.exports = {
    name:'booster',
    description:'Open boosters in your inventory',
    category:'Inventory',
    use: "`!booster` - Affiche votre nombre de booster et vous permet d'en ouvrir",
    example: "`!booster`",
    async execute(message, args){
        let user = message.author
        const element = await mongoose.Inventory.findOne({ user: user.id});
        let inventory = element.inventory.toObject()
        if(element != undefined){
            const nBoosters = inventory.filter(x => x==10).length
            let Embed = new MessageEmbed()
                .setDescription(`You have **${nBoosters}** boosters`)
                .setColor('DARK_GOLD');
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('1')
                        .setLabel('Open one')
                        .setStyle('SUCCESS')
                        .setDisabled(!Boolean(nBoosters)),
                    new MessageButton()
                        .setCustomId('all')
                        .setLabel('Open all')
                        .setStyle('PRIMARY')
                        .setDisabled(!Boolean(nBoosters)),
                    new MessageButton()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
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
                        Embed.description = 'Opening **1** booster...'
                        await botmessage.edit({embeds:[Embed], components:[]})
                        const cardwon = cards[getRandomInt(0,cards.length)]
                        await inventory.splice(inventory.indexOf(10), 1, cardwon.id)
                        await wait(2500)
                        await mongoose.Inventory.findOneAndUpdate(
                            { user: user.id},
                            { $set: { inventory: inventory}}
                        )
                        Embed.description = `You found 1x **${cardwon.name}!**`
                        await botmessage.edit({embeds:[Embed]})
                        show.execute(botmessage,[cardwon.id])
                        break;
                    case 'all':
                        fullfilled = true;
                        collector.stop()
                        Embed.description = `Opening **${nBoosters}** boosters...`
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
                            cardswoniterable.push([cardswon[0],cardswon.filter(x => x==cardswon[0]).length]) // push in cardswoniterable an array with arr[0]=cardX and arr[1]=number of occurences of cardX in cardswon"ééé
                            cardswon = removeItem(cardswon,cardswon[0])
                        }
                        let Description = 'You found'
                        for(i in cardswoniterable){
                            if(i<cardswoniterable.length-1){
                                Description += ` ${cardswoniterable[i][1]}x **${cardswoniterable[i][0].name}**,`
                            }else{
                                Description += ` and ${cardswoniterable[i][1]}x **${cardswoniterable[i][0].name}**!`
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
            message.reply("Vous n'avez pas d'inventaire (Récupérez un objet ou rendez-vous dans le magasin pour pouvoir l'afficher)")
        }
    }
}