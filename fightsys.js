/// Dependencies ///

const { MessageEmbed, MessageActionRow, MessageButton} = require('discord.js'); //Discord components
const objects = require('./database/objects.json'); //All existing items
const cards = require('./database/cards.json'); //All the cards (more specifically than objects)
const mongoose = require('./database/mongoose'); //Database for the inventories
const {removeItem, getRandomInt} = require('./maths'); //Basic functions
const {cardsEffects} = require('./database/cardsScripts'); //Scripts for the cards
const wait = require('util').promisify(setTimeout); //Wait x ms
///_____________________________________________________________///


function initFight(message, target, p1inventory, p2inventory){ // Create players objects 
    let p1 = {
        "member":message.member,
        "vie":100,
        "viemax":100,
        "mana":100,
        "manamax":100,
        "atk":10,
        "def":0,
        "skills": cards.filter(x => p1inventory.filter(x=> objects.find(i => i.id==x).card).includes(x.id))
    }
    let p2 = {
        "member":target,
        "vie":100,
        "viemax":100,
        "mana":100,
        "manamax":100,
        "atk":10,
        "def":0,
        "skills": cards.filter(x=> p2inventory.filter(x=> objects.find(i => i.id==x).card).includes(x.id))
    }
    let tour = p1
    let other = p2
    setMessage(message, p1, p2, tour, other, undefined)
}

function getInventory1(message, target){ // get inventory of the 1rst player
    let user = message.member.user
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
                const i1 = [...element.inventory]
                getInventory2(message, target, i1)
            }
            if(doc === true){
                const element = await mongoose.Inventory.findOne({user:user.id})
                const i1 = [...element.inventory]
                getInventory2(message, target, i1)
            }
        }
    });
}

function getInventory2(message, target, i1){ // get inventory of the 2nd player
    let user = target.user
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
                const i2 = [...element.inventory]
                initFight(message, target, i1, i2)
            }
            if(doc === true){
                const element = await mongoose.Inventory.findOne({user:user.id})
                const i2 = [...element.inventory]
                initFight(message, target, i1, i2)
            }
        }
    });
}

async function setMessage(message, p1, p2 ,tour,other, botmessage){ // Send or update the bot's message with infos about players
    let Embed = await new MessageEmbed()
    .addFields(
        { name: p1.member.displayName ,value:`Vie : ${p1.vie}\nMana : ${p1.mana}\nDégâts : ${p1.atk}\nDéfense : ${p1.def}`,inline:true},
        { name:"  Contre  ",value:"_\n_\n_\n\_",inline:true},
        { name: p2.member.displayName ,value:`Vie : ${p2.vie}\nMana : ${p2.mana}\nDégâts : ${p2.atk}\nDéfense : ${p2.def}`,inline:true},
        { name: `–––––––––––—————————————`, value: `C'est au tour de : **${tour.member.displayName}**`}
    )
    .setColor('DARK_BLUE');
    let row = await new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('atk')
                    .setLabel('Attack')
                    .setStyle('SECONDARY')
                    .setEmoji('⚔️'),
                new MessageButton()
                    .setCustomId('skill')
                    .setLabel('Use Card')
                    .setStyle('SECONDARY')
                    .setEmoji('🃏')
                    .setDisabled(!Boolean(tour.skills.length)),
                new MessageButton()
                    .setCustomId('def')
                    .setLabel('Block')
                    .setStyle('SECONDARY')
                    .setEmoji('🛡️'),
                new MessageButton()
                    .setCustomId('giveup')
                    .setLabel('Give Up')
                    .setStyle('DANGER'),
            )
    if(botmessage == undefined){
        const botmessage = await message.channel.send({embeds:[Embed], components: [row]})
        startCollector(message, p1, p2, tour, other, botmessage, 0)
    }else{
        await botmessage.edit({embeds:[Embed], components: [row]})
        startCollector(message, p1, p2, tour, other, botmessage, 0)
    }
}   

function startCollector(message, p1, p2, tour, other, botmessage, initialTimer){ // Collect interactions from buttons
    const filter = i => ['atk','skill','def', 'giveup'].includes(i.customId) && [tour.member, other.member].includes(i.member)

    const collector = message.channel.createMessageComponentCollector({ filter, time: 60_000 - initialTimer});
    let timer = Date.now()
    let fullfilled = false
    collector.on('collect', async i => {
        if(i.message.id === botmessage.id){
            if(i.member == tour.member){
                switch (i.customId){
                    case 'atk':
                        const damages = tour.atk*getRandomInt(70,110)/100
                        const blocked = getRandomInt(30,60)/100*other.def
                        if(damages >= blocked){
                            other.vie = Number((other.vie - (damages-blocked)).toFixed(2))
                        }
                        i.update(i)
                        fullfilled = true;
                        collector.stop()
                        break;
                    case 'skill':
                        const skillsEmbed = new MessageEmbed()
                            .setTitle('Choose a card to use');
                        for(a of tour.skills){
                            skillsEmbed.addFields({name: `${a.name} (${a.mana.toString()})`, value: a.use, inline:true})
                        }
                        const skills = await setSkillsComponents(tour);
                        const replymessage = await i.reply({embeds: [skillsEmbed],components: skills, fetchReply: true, ephemeral: false})
                        timer = Date.now() - timer
                        cardCollector(message, p1, p2, tour, other, botmessage, replymessage, timer)
                        fullfilled = true;
                        collector.stop()
                        break;
                    case 'def':
                        tour.def += getRandomInt(1,4)
                        i.update(i)
                        fullfilled = true;
                        collector.stop()
                        break;
                    case 'giveup':
                        fullfilled = true;
                        win(other.member, tour.member, botmessage, true)
                        collector.stop()
                        break;
                }
            }else{
                i.reply({content: "Ce n'est pas votre tour de jouer !", ephemeral:true})
            }
        }
    });

    collector.on('end', async collected => {
        if(fullfilled){
            const iID = collected.at(collected.size-1).customId
            if(['def','atk'].includes(iID)){
                nextTour(message, p1, p2, tour, other, botmessage)
            }
        }else{
            nextTour(message, p1, p2, tour, other, botmessage)
            const timeoutmessage = await botmessage.reply({content:`Le temps est écoulé, ${tour.member.displayName} passe son tour !`})
            await wait(4000)
            timeoutmessage.delete();
        }
    });
}

function setSkillsComponents(tour){ // Create a button for each player's skill (card)
        let skills = []
        const cancelButton = new MessageButton()
            .setCustomId('back')
            .setLabel('Cancel')
            .setStyle('DANGER');
        for (let a = 0; a < Math.ceil(tour.skills.length/5); a++){
            skills.push(new MessageActionRow())
            const max = (tour.skills.length - 5*a) > 5 ? 5 : tour.skills.length
            for(let i = 0; i < max; i++){
                skills[a].addComponents(
                    new MessageButton()
                        .setCustomId((tour.skills[i + 5*a].id).toString())
                        .setLabel(tour.skills[i + 5*a].name)
                        .setStyle('PRIMARY')
                        .setDisabled(tour.skills[i + 5*a].mana>tour.mana)
                )
            }
            if(a+1>=Math.ceil(tour.skills.length/5) && max < 5){
                skills[a].addComponents(cancelButton)
            }
        }
        if(!skills[skills.length-1].components.includes(cancelButton)){
            skills.push(new MessageActionRow())
            skills[skills.length-1].addComponents(cancelButton)
        }
        return(skills)
}

function nextTour(message, p1, p2 , tour, other, botmessage){ // Pass to next round
    p1=[tour,other].find(x=>x.member == p1.member)
    p2=[tour,other].find(x=>x.member==p2.member)
    const oldtour = tour
    tour = other
    other = oldtour
    tour.mana += 10
    if(p1.vie>0 && p2.vie>0){
        setMessage(message,p1,p2,tour,other,botmessage)
    }else if(p1.vie<=0){
        win(p2.member, p1.member, botmessage, false)
    }else if(p2.vie<=0){
        win(p1.member, p2.member, botmessage, false)
    }
}

function cardCollector(message, p1, p2 ,tour, other, botmessage, replymessage, timer){ // Collect interactions from skills buttons 
    const skillsId = []
    tour.skills.forEach(x => skillsId.push(x.id))
    const filter = i => (skillsId.includes(Number(i.customId)) || i.customId == 'back') && [tour.member, other.member].includes(i.member)
    const collector = replymessage.channel.createMessageComponentCollector({ filter, time: 60_000-timer});
    
    let fullfilled = false
    let startTime = Date.now()
    collector.on('collect', i => {
        if(i.message.id === replymessage.id){
            if(i.member == tour.member){
                if(i.customId != 'back'){
                    fullfilled = true
                    const updates = cardsEffects(tour, other, Number(i.customId))
                    tour = updates[0];
                    other = updates[1];
                    tour.skills = removeItem(tour.skills, cards.find(x=> x.id ==i.customId))
                    nextTour(message, p1, p2, tour, other, botmessage)
                    //i.update(i)
                    collector.stop()
                }else{
                    startTime = (Date.now() - startTime) + timer
                    fullfilled = true
                    startCollector(message, p1, p2, tour, other, botmessage, startTime)
                    collector.stop()
                }
            }else{
                i.reply({content: "Ce n'est pas votre tour de jouer !", ephemeral:true})
            }
        }
    });

    collector.on('end', async collected => {
        if(!fullfilled){
            nextTour(message, p1, p2, tour, other, botmessage)
            const timeoutmessage = await botmessage.reply({content:`Le temps est écoulé, ${tour.member.displayName} passe son tour !`})
            await wait(4000)
            timeoutmessage.delete();
        }
        replymessage.delete()
    });
}

function win(winner,looser, botmessage, forfait){ // Update the bot message to announce the winner (and the looser)
    const forfaitSTR = forfait ? ' par forfait ' : ' '
    const Embed = new MessageEmbed()
        .setDescription(`**${winner.displayName}** a battu **${looser.displayName}**${forfaitSTR}!`)
        .setThumbnail(winner.avatarURL);
    botmessage.edit({embeds:[Embed], components:[]})
}


module.exports = {getInventory1}