const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const objects = require('./objects.json').filter(x => x.saleable)
const mongoose = require('./mongoose');
const {removeItem} = require('../maths');

function initSetPage(page, message, oldmessage){
    let Embed = new MessageEmbed()
            .setColor('ffd700')
            .setImage('https://cdn.dribbble.com/users/1454037/screenshots/5632782/store-final---animated-dribbbler-bottomt.gif')
            .setFooter({text:`Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })});   
    getInventory(Embed, page, message, oldmessage, SetPage)
}

function getInventory(Embed, page, message, oldmessage, callback){
    let user = message.author
    mongoose.Inventory.exists({user: user.id}, async function (err,doc){ 
        if(err){
            console.log(err)
        }else{
            if(doc === false){
                const element = await mongoose.Inventory.create({
                    user: user.id, 
                    inventory: [],
                    money: 0
                });
                await element.save();
                console.log('Inventory created')
                callback(Embed, page, message, element, oldmessage)
            }
            if(doc === true){
                const element = await mongoose.Inventory.findOne({user:user.id})
                callback(Embed, page, message, element, oldmessage)
            }
        }
    });
}

async function SetPage(Embed, page, message, element, oldmessage){
    switch (page) {
        case 'home':
            var pageobj = {
                name:'home',
                title:'Magasin',
                description:'Bienvenue dans le magasin !',
                fields:[],
                row: new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('sell')
                            .setLabel('Vendre')
                            .setStyle('DANGER')
                            .setEmoji('🛒'),
                        new MessageButton()
                            .setCustomId('buy')
                            .setLabel('Acheter')
                            .setStyle('SUCCESS')
                            .setEmoji('💰'),
                    )
        
            };
            break;

        case 'buy' :
            pageobj = {
                name:'buy',
                title:'Achats',
                description:`Dépensez donc quelques pièces !\nVotre argent : ${element.money} :coin:`,
                fields: setfields('buy',element),
                row: new MessageActionRow()
                    .addComponents( 
                        new MessageSelectMenu()
                            .setCustomId('selectB')
                            .setPlaceholder('Aucun item choisi')
                            .addOptions(setOptions('buy',element))
                    )
                
            };
            break;
        case 'sell':
            pageobj = {
                name:'sell',
                title:'Vente',
                description:`Voyons voir ce que vous avez... \nVotre argent : ${element.money} :coin:`,
                fields: setfields('sell',element),
                row: new MessageActionRow()
                .addComponents( 
                    new MessageSelectMenu()
                        .setCustomId('selectS')
                        .setPlaceholder('Aucun item choisi')
                        .addOptions(setOptions('sell',element))
                )
            };
            break;
    }

    Embed
        .setDescription(pageobj.description)
        .setTitle(pageobj.title);
    Embed.fields=pageobj.fields
    if(oldmessage === undefined){
        var botmessage = await message.channel.send({components : [pageobj.row], embeds: [Embed]})
    }else{
        var botmessage = await oldmessage.edit({ components : [pageobj.row], embeds: [Embed]})
    }
    responding(message,botmessage,element)

}

function setfields(page,element){
    let FieldsArray = []
    switch (page) {
        case 'buy':
            for (item in objects) {
                FieldsArray.push({
                    name: objects[item].name,
                    value: `${objects[item].cost} :coin:`,
                    inline: true,
                });
            }
            break;
        case 'sell':
            let items = []
            let inventaire = element.inventory.toObject()
            inventaire.sort((a,b) => a-b)
            while (inventaire.length>0){
                items.push([inventaire[0],inventaire.filter(x => x==inventaire[0]).length])
                inventaire = removeItem(inventaire,inventaire[0])
            }
            items.forEach(function(item){
                FieldsArray.push({
                    name: `${objects.find(o=>o.id===item[0]).name} x${item[1]}`,
                    value: `${Math.round((objects.find(o=>o.id===item[0]).cost)*0.75)}:coin:`,
                    inline: true
                })
            })
            break;

    }
    return(FieldsArray)
}

function setOptions(page,element){
    let options=[]
    switch (page) {
        case 'buy':
            for (item in objects) {
                options.push({
                    label: objects[item].name,
                    description: objects[item].description,
                    value: (objects[item].id).toString(),
                });
            }
            break;
        case 'sell':
            let items = []
            let inventaire = element.inventory.toObject()
            inventaire.sort((a,b) => a-b)
            while (inventaire.length>0){
                items.push([inventaire[0],inventaire.filter(x => x==inventaire[0]).length])
                inventaire = removeItem(inventaire,inventaire[0])
            }
            items.forEach(function(item){
                options.push({
                    label: objects.find(o=>o.id===item[0]).name,
                    description: objects.find(o=>o.id===item[0]).description,
                    value: (objects.find(o=>o.id===item[0]).id).toString(),
                })
            })
            break;
            
    }
    options.push({
        label: '↩️',
        description: 'Revenir au menu précédent',
        value: 'backH',
    });
    return(options)
}

function responding(message, botmessage, element){
    const filter = i => i.user.id === message.author.id;
    const collector = botmessage.createMessageComponentCollector({ filter, max: 1, maxComponents: 1, time: 30_000 });

    collector.on('collect', async i => {
        switch (i.customId) {
            case 'sell':
                await i.update(i)
                initSetPage('sell', message, botmessage)
                break;
            case 'buy':
                await i.update(i)
                initSetPage('buy', message, botmessage)
                break;
            case 'selectS':
                if (i.values[0]==='backH'){
                    await i.update(i)
                    initSetPage('home', message, botmessage)
                }else{
                    const itemId = parseInt(i.values[0])
                    const index = element.inventory.indexOf(itemId);
                    const item = objects.find(o=>o.id===itemId)

                    let inventoryUpdate = element.inventory.toObject()
                    inventoryUpdate.splice(index,1);
                    let moneyUpdate = element.money + Math.round((item.cost)*0.75);
                    await mongoose.Inventory.findOneAndUpdate({user: message.author.id}, { $set: {inventory: inventoryUpdate , money: moneyUpdate}});

                    await i.reply({content: `L'objet ${item.name} a bien été vendu !`, ephemeral: true})
                    initSetPage('sell', message, botmessage)
                }
                break;
            case 'selectB':
                if(i.values[0] === 'backH'){
                    await i.update(i)
                    initSetPage('home', message, botmessage)
                }else{
                    const itemId = parseInt(i.values[0])
                    const item = objects.find(o=>o.id===itemId)

                    if(item.cost<=element.money){
                        let moneyUpdate = element.money - item.cost;
                        await mongoose.Inventory.findOneAndUpdate({user: message.author.id}, { $push: {inventory:item.id}, $set: {money: moneyUpdate}});

                        await i.reply({content: `L'objet ${item.name} a bien été acheté !`, ephemeral: true})
                        initSetPage('buy', message, botmessage)
                    }else{
                        await i.reply({content: `:warning: Vous n'avez pas l'argent nécessaire ! (Il vous manque ${item.cost-element.money} :coin: )`,ephemeral:true})
                        initSetPage('buy', message, botmessage)
                    }
                }

        }
    });

    collector.on('end', async collected => {
        if(collected.size===0){
            let Embed = new MessageEmbed()
                .setColor('ffd700')
                .setTitle('Magasin fermé !');
            botmessage.edit({embeds:[Embed], components: []}); 
        }
    })
}
module.exports = {initSetPage} 



