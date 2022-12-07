const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const {Inventory} = require('../database/mongoose')
const objects = require('../database/objects.json')
module.exports = {
    name: "trade",
    description: "Trade you cards with others.",
    category: "Inventory",
    use: "`!trade <id1> <user> <id2>` - Echange votre item `id1` contre l'item `id2` de l'utilisateur mentionné",
    example: "`!trade 5 @R2D2 7",
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
                .addFields(
                    {name: `${message.author.username} reçoit :`, value: objects.find(x=> x.id == args[2]).name, inline: true },
                    {name: `${message.mentions.members.first().user.username} reçoit :`, value: objects.find(x=> x.id==args[0]).name, inline: true}
                )
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
            responding(message, args, botmessage, inventory1, inventory2)
        }else{
            const Embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setDescription(`${message.mentions.members.first().user.username} ne possède pas l'item que vous voulez lui échanger`)
                .setFooter({text: ''})
            message.reply({embeds: [Embed]})
        }
    }else{
        const Embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setDescription("Vous ne possédez pas l'item que vous voulez échanger");
        message.reply({embeds: [Embed]})
    }
}

function responding(message, args, botmessage, inventory1, inventory2){
    const target = message.mentions.members.first()
    const filter = i => ['ok', 'no'].includes(i.customId) && i.member.user.id == target.user.id && i.message.id == botmessage.id
    const collector = message.channel.createMessageComponentCollector({filter, time:60_000})

    collector.on('collect', async i => {
        switch (i.customId){
            case 'ok':
                await i.update(i)
                const EmbedOk = new MessageEmbed()
                    .setColor('DARK_ORANGE')
                    .setDescription("Êtes-vous certains de vouloir accepter cette offre ?")
                    .addFields(
                        {name: 'Vous recevez :', value: objects.find(x=> x.id==args[0]).name, inline: true},
                        {name: 'Vous perdez :', value: objects.find(x=> x.id == args[2]).name, inline: true}
                    );
                await botmessage.edit({embeds: [EmbedOk]})
                confirm(message, args, botmessage, inventory1, inventory2)
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

function confirm(message, args, botmessage, inventory1, inventory2){
    const target = message.mentions.members.first()
    const filter = i => ['ok', 'no'].includes(i.customId) && i.member.user.id == target.user.id && i.message.id == botmessage.id
    const collector = message.channel.createMessageComponentCollector({filter, time:60_000})

    collector.on('collect', async i => {
        switch (i.customId){
            case 'ok':
                await i.update(i)
                await inventory1.inventory.splice(inventory1.inventory.indexOf(Number(args[0])), 1, Number(args[2]))    //replace the card offered with the card received
                await inventory2.inventory.splice(inventory2.inventory.indexOf(Number(args[2])), 1, Number(args[0]))
                await Inventory.findOneAndUpdate(
                    { user: message.author.id},
                    { $set: { inventory: inventory1.inventory}}
                )
                await Inventory.findOneAndUpdate(
                    { user: target.user.id},
                    { $set: { inventory: inventory2.inventory}}
                )

                const sendedcard = Number(args[0])
                const receivedcard = Number(args[2])  
                const EmbedOk = new MessageEmbed()
                    .setDescription(`**${target.user.username}** a accepté l'offre de **${message.author.username}**`)
                    .setColor('DARK_GREEN');
                const Embed1 = new MessageEmbed()
                    .setDescription(`${message.author} a reçu l'objet \`${objects.find(x=> x.id == args[2]).name}\``)
                    .setColor('DARK_GOLD');
                const Embed2 = new MessageEmbed()
                    .setDescription(`${target.user} a reçu l'objet \`${objects.find(x=> x.id==args[0]).name}\``)
                    .setColor('DARK_GOLD');
                await botmessage.edit({embeds: [EmbedOk, Embed1, Embed2], components:[]})
                
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