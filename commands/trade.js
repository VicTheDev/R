const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const {Inventory} = require('../database/mongoose')
const objects = require('../database/objects.json')
module.exports = {
    name: "trade",
    description: "Trade you cards with others.",
    category: "Inventory",
    async execute(message, args){
        if(message.mentions.members.first()!=undefined){
            let user = message.author
    
            Inventory.exists({ user: user.id }, async function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    if (doc === false) {
                        let inventory1 = await Inventory.create({
                            user: user.id,
                            inventory: [],
                            money: 0,
                            daily: Date.now()
                        });
                        await inventory1.save();
                        inventory1 = inventory1.toObject();
                        console.log('Inventory created');
                        getInventory(message, args, inventory1)
                    }
                    if (doc === true) {
                        let inventory1 = await Inventory.findOne({ user: user.id });
                        inventory1 = inventory1.toObject();
                        getInventory(message, args, inventory1)
                    }
                }
            });
        }else{
            const Embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setDescription("Vous devez mentionnez quelqu'un !");
            message.reply({embeds: [Embed]})
        }
    }
}
function getInventory(message, args, inventory1){
    const user = message.mentions.members.first().user
    Inventory.exists({ user: user.id }, async function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (doc === false) {
                let inventory2 = await Inventory.create({
                    user: user.id,
                    inventory: [],
                    money: 0,
                    daily: Date.now()
                });
                await inventory2.save();
                inventory2 = inventory2.toObject();
                console.log('Inventory created');
                initTrade(message, args, inventory1, inventory2)
            }
            if (doc === true) {
                let inventory2 = await Inventory.findOne({ user: user.id });
                inventory2 = inventory2.toObject();
                initTrade(message, args, inventory1, inventory2)
            }
        }
    });
}
async function initTrade(message, args, inventory1, inventory2){
    if(inventory1.inventory.find(x => x==args[0]) != undefined){
        if(inventory2.inventory.find(x => x==args[2]) != undefined){
            const Embed = new MessageEmbed()
                .setTitle("Offre d'échange")
                .setDescription(`**${message.member.user.username}** propose à **${message.mentions.members.first().user.username}** d'échanger 
                    \`${objects.find(x=> x.id==args[0]).name}\` contre \`${objects.find(x=> x.id == args[2]).name}\``)
                .setColor('GREEN');
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('ok')
                        .setLabel('Accepter')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('no')
                        .setLabel('Décliner')
                        .setStyle('DANGER')
                );
            const botmessage = await message.channel.send({embeds:[Embed], components: [row]})
            responding(message, args, botmessage)
        }else{
            const Embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setDescription(`${message.mentions.members.first().user.username} ne possède pas l'item que vous voulez lui échanger`);
            message.reply({embeds: [Embed]})
        }
    }else{
        const Embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setDescription("Vous ne possédez pas l'item que vous voulez échanger");
        message.reply({embeds: [Embed]})
    }
}

function responding(message, args, botmessage){
    const target = message.mentions.members.first()
    const filter = i => ['ok', 'no'].includes(i.customId) && i.member.user.id == target.user.id && i.message.id == botmessage.id
    const collector = message.channel.createMessageComponentCollector({filter, time:30_000})

    collector.on('collect', async i => {
        switch (i.customId){
            case 'ok':
                const EmbedOk = new MessageEmbed()
                    .setColor('DARK_ORANGE')
                    .setDescription("Êtes-vous sûrs de vouloir accepter cette offre ?")
                    .addFields(
                        {name: 'Vous recevez :', value: objects.find(x=> x.id==args[0]).name, inline: true},
                        {name: 'Vous perdez :', value: objects.find(x=> x.id == args[2]).name, inline: true}
                    );
                await botmessage.edit({embeds: [EmbedOk]})
                confirm(message, args, botmessage)
                collector.stop()
                break;
            case 'no':
                await i.update(i)
                const EmbedNo = new MessageEmbed()
                    .setDescription(`**${target.user.username}** a refusé l'offre de **${message.author.username}**`)
                    .setColor('DARK_GREEN');
                await botmessage.edit({embeds: [EmbedNo], components: []})
                collector.stop()
                break;
        }
    })
}

function confirm(message, args, botmessage){
    const target = message.mentions.members.first()
    const filter = i => ['ok', 'no'].includes(i.customId) && i.member.user.id == target.user.id && i.message.id == botmessage.id
    const collector = message.channel.createMessageComponentCollector({filter, time:30_000})

    collector.on('collect', async i => {
        switch (i.customId){
            case 'ok':
                console.log('ok') // TRADING CARD FINALLY ACCEPTED // Code the trade in inventories
                collector.stop()
                break;
            case 'no':
                await i.delete()
                const EmbedNo = new MessageEmbed()
                    .setDescription(`**${target.user.username}** a refusé l'offre de **${message.author.username}**`)
                    .setColor('DARK_GREEN');
                await botmessage.edit({embeds: [EmbedNo], components: []})
                collector.stop()
                break;
        }
    })
}