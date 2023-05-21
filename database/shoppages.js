const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Message } = require('discord.js');
const objectsraw = require('./objects.json').filter(x => x.saleable)
const mongoose = require('./mongoose');
const {removeItem} = require('../maths');
const {i18n} = require('../i18n/i18n')

function initSetPage(page, message, oldmessage){
    let Embed = new MessageEmbed()
            .setColor('ffd700')
            //.setImage('https://cdn.dribbble.com/users/1454037/screenshots/5632782/store-final---animated-dribbbler-bottomt.gif')
            .setImage([0,11,1].includes(new Date().getMonth()) ? 'https://i.pinimg.com/originals/e4/e9/b5/e4e9b5a67459c5a9b7690e6bd59b818e.gif' : 'https://cdn.dribbble.com/users/1454037/screenshots/5632782/store-final---animated-dribbbler-bottomt.gif')
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
    const guildId = message.guildId
    switch (page) {
        case 'home':
            var pageobj = {
                name:'home',
                title: i18n.t("commands.inventory.shop.pages.home.title",guildId),
                description: i18n.t("commands.inventory.shop.pages.home.description",guildId),
                fields:[],
                row: [new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('buy')
                            .setLabel(i18n.t("commands.inventory.shop.pages.home.row.buy",guildId))
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('sell')
                            .setLabel(i18n.t("commands.inventory.shop.pages.home.row.sell",guildId))
                            .setStyle('PRIMARY')
                    )]
        
            };
            break;

        case 'buy' :
            pageobj = {
                name:'buy',
                title: i18n.t("commands.inventory.shop.pages.buy.title",guildId),
                description: i18n.t("commands.inventory.shop.pages.buy.description",guildId,{money:element.money}),
                fields: setfields('buy',element,guildId),
                row: [new MessageActionRow()
                    .addComponents( 
                        new MessageSelectMenu()
                            .setCustomId('selectB')
                            .setPlaceholder(i18n.t("commands.inventory.shop.pages.placeholder",guildId))
                            .addOptions(setOptions('buy',element,guildId))
                    )]
                
            };
            break;
        case 'sell':
            pageobj = {
                name:'sell',
                title: i18n.t("commands.inventory.shop.pages.sell.title",guildId),
                description:i18n.t("commands.inventory.shop.pages.home.description",guildId,{money:element.money}),
                fields: setfields('sell',element,guildId),
                row: [new MessageActionRow()
                .addComponents( 
                    new MessageSelectMenu()
                        .setCustomId('selectS')
                        .setPlaceholder(i18n.t("commands.inventory.shop.pages.placeholder",guildId))
                        .addOptions(setOptions('sell',element,guildId))
                )]
            };
            break;
    }

    if(pageobj.name=='home'){
        pageobj.row[0]
            .addComponents(
                new MessageButton()
                    .setCustomId('close')
                    .setLabel(i18n.t("commands.inventory.shop.pages.home.row.close",guildId))
                    .setStyle('DANGER')
            );
    }

    Embed
        .setDescription(pageobj.description)
        .setTitle(pageobj.title);
    Embed.fields=pageobj.fields
    if(oldmessage === undefined){
        var botmessage = await message.channel.send({components : pageobj.row, embeds: [Embed]})
    }else{
        var botmessage = await oldmessage.edit({ components : pageobj.row, embeds: [Embed]})
    }
    responding(message,botmessage,element, Embed)

}

function setfields(page,element,guildId){
    let objects = i18n.i(objectsraw,guildId)
    let FieldsArray = []
    switch (page) {
        case 'buy':
            for (let item in objects) {
                FieldsArray.push({
                    name: objects[item].name,
                    value: `\`${objects[item].cost}\` :coin:`,
                    inline: true,
                });
            }
            break;
        case 'sell':
            let items = []
            let inventaire = element.inventory.toObject().filter(x => objects.find(a => a.id==x) !== undefined)  
                                                        // this filter allows to keep only the values that are in the objects array (which contains only sellable items)     
            inventaire.sort((a,b) => a-b) 
            while (inventaire.length>0){
                items.push([inventaire[0],inventaire.filter(x => x==inventaire[0]).length])
                inventaire = removeItem(inventaire,inventaire[0])
            }
            items.forEach(function(item){
                FieldsArray.push({
                    name: `${objects.find(o=>o.id===item[0]).name} x${item[1]}`,
                    value: `\`${Math.round((objects.find(o=>o.id===item[0]).cost)*0.75)}\` :coin:`,
                    inline: true
                })
            })
            break;

    }
    return(FieldsArray)
}

function setOptions(page,element,guildId){
    let objects = i18n.i(objectsraw,guildId)
    let options=[]
    switch (page) {
        case 'buy':
            for (let item in objects) {
                options.push({
                    label: objects[item].name,
                    description: objects[item].description,
                    value: (objects[item].id).toString(),
                });
                console.log(options)
            }
            break;
        case 'sell':
            let items = []
            let inventaire = element.inventory.toObject().filter(x => objects.find(a => a.id==x) !== undefined)   
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
        description: i18n.t("commands.inventory.shop.pages.back",guildId),
        value: 'backH',
    });
    return(options)
}

function responding(message, botmessage, element, Embed){
    const guildId = message.guildId
    let objects = i18n.i(objectsraw,message.guildId)
    const filter = i => i.user.id === message.author.id;
    const collector = botmessage.createMessageComponentCollector({ filter, max: 1, maxComponents: 1, time: 30_000 });

    let close = false
    collector.on('collect', async i => {
        switch (i.customId) {
            case 'sell':
                await i.update(i)
                //initSetPage('sell', message, botmessage)
                SetPage(Embed, 'sell', message, element, botmessage)
                break;
            case 'buy':
                await i.update(i)
                //initSetPage('buy', message, botmessage)
                SetPage(Embed, 'buy', message, element, botmessage)
                break;
            case 'selectS':
                console.log(i.values)
                if (i.values[0]==='backH'){
                    await i.update(i)
                    //initSetPage('home', message, botmessage)
                    SetPage(Embed, 'home', message, element, botmessage)
                }else{
                    const itemId = parseInt(i.values[0])
                    const index = element.inventory.indexOf(itemId);
                    const item = objects.find(o=>o.id===itemId)

                    let inventoryUpdate = element.inventory.toObject()
                    inventoryUpdate.splice(index,1);
                    let moneyUpdate = element.money + Math.round((item.cost)*0.75);
                    await mongoose.Inventory.findOneAndUpdate({user: message.author.id}, { $set: {inventory: inventoryUpdate , money: moneyUpdate}});

                    await i.reply({content: i18n.t("commands.inventory.shop.sold",guildId,{item:item.name}), ephemeral: true})
                    initSetPage('sell', message, botmessage)
                }
                break;
            case 'selectB':
                if(i.values[0] === 'backH'){
                    await i.update(i)
                    //initSetPage('home', message, botmessage)
                    SetPage(Embed, 'home', message, element, botmessage)
                }else{
                    const itemId = parseInt(i.values[0])
                    const item = objects.find(o=>o.id===itemId)

                    if(item.cost<=element.money){
                        let moneyUpdate = element.money - item.cost;
                        await mongoose.Inventory.findOneAndUpdate({user: message.author.id}, { $push: {inventory:item.id}, $set: {money: moneyUpdate}});

                        await i.reply({content: i18n.t("commands.inventory.shop.bought",guildId,{item:item.name}), ephemeral: true})
                        initSetPage('buy', message, botmessage)
                    }else{
                        await i.reply({content: i18n.t("commands.inventory.shop.warning",guildId,{money:item.cost-element.money}),ephemeral:true})
                        //initSetPage('buy', message, botmessage)
                        SetPage(Embed, 'buy', message, element, botmessage)
                    }
                }
                break;
            case 'close':
                close = true
                collector.stop()
                break;

        }
    });

    collector.on('end', async collected => {
        if(collected.size===0 || close){
            let Embed = new MessageEmbed()
                .setColor('ffd700')
                .setTitle(i18n.t("commands.inventory.shop.closed",message.guildId));
            botmessage.edit({embeds:[Embed], components: []}); 
        }
    })
}
module.exports = {initSetPage} 



