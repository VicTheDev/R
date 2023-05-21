/// Dependencies ///

const { MessageEmbed, MessageActionRow, MessageButton} = require('discord.js'); //Discord components
const objects = require('../database/objects.json'); //All existing items
const cards = require('../database/cards.json'); //All the cards (more specifically than objects)
const mongoose = require('../database/mongoose'); //Database for the inventories
const {removeItem, getRandomInt} = require('../maths'); //Basic functions
const {cardsEffects} = require('../database/cardsScripts'); //Scripts for the cards
const wait = require('util').promisify(setTimeout); //Wait x ms
///_____________________________________________________________///
const cooldown = new Set();
const {i18n} = require('../i18n/i18n');

module.exports = {
    name: "fight",
    category: "Fun",
	async execute(message, args) {
        const guildId = message.guildId
        let count = 0
        const member = message.member;
        const target = message.mentions.members.first()
        if(target != undefined && target != member){
            if(!cooldown.has(member.user.id)){
                if(!cooldown.has(target.user.id)){
                    cooldown.add(member.user.id)

                    //message.delete()

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('ok')
                                .setLabel(i18n.t("commands.fun.accept",guildId))
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('no')
                                .setLabel(i18n.t("commands.fun.decline",guildId))
                                .setStyle('DANGER')
                        );

                    const acceptmessage = await message.channel.send({content:i18n.t("commands.fun.fight.challenged",guildId,{user:member.user,target:target.user}), components: [row]})
                    const filter = i => i.message.id == acceptmessage.id && ['ok','no'].includes(i.customId) && i.member == target;
                    const collector = acceptmessage.channel.createMessageComponentCollector({filter, time: 20_000});
                    
                    let answered = false
                    collector.on('collect', async i => {
                        switch (i.customId){
                            case 'ok':
                                await acceptmessage.edit({content:i18n.t("commands.fun.accepted",guildId,{user:target.user,game:i18n.t("commands.fun.fight.game",guildId)}), components: []})
                                cooldown.add(target.user.id)
                                setTimeout(() => {
                                    acceptmessage.delete()
                                    getInventory1(message,target)
                                }, 2000)
                                answered = true
                                collector.stop()
                                break;
                            case 'no':
                                await acceptmessage.edit({content: i18n.t("commands.fun.declined",guildId,{user:target.displayName,game:i18n.t("commands.fun.fight.game",guildId)}) , components: []})
                                cooldown.delete(member.user.id)
                                answered = true
                                setTimeout(() => {
                                    acceptmessage.delete()
                                }, 3000)
        
                        }
                    })
        
                    collector.on('end', async collected => {
                        if(!answered){
                            await acceptmessage.edit({content: i18n.t("commands.fun.declined",guildId,{user:target.displayName,game:i18n.t("commands.fun.fight.game",guildId)}) , components: []})
                            cooldown.delete(member.user.id)
                                setTimeout(() => {
                                    acceptmessage.delete()
                                }, 3000)
                        }
                    })
                }else{
                    const reply = await message.reply(i18n.t("commands.fun.fight.targetunavailable",guildId,{user:target.displayName}))
                    message.delete()
                    setTimeout(() => {
                        reply.delete()
                    }, 3000)
                }
            }else{
                const reply = await message.reply(i18n.t("commands.fun.fight.unavailable",guildId))
                message.delete()
                setTimeout(() => {
                    reply.delete()
                }, 3000)
            }
        }else{
            const reply = await message.reply(i18n.t("commands.interaction.mentionmissing",guildId))
            message.delete()
            setTimeout(() => {
                reply.delete()
            }, 3000)
        }
        function initFight(message, target, p1inventory, p2inventory){ // Create players objects 
            let p1cardsAll = i18n.i(cards.filter(x => p1inventory.filter(x=> objects.find(i => i.id==x).card).includes(x.id)),guildId)
            let p1cardsunit = []
            while (p1cardsAll.length>0){
                p1cardsunit.push(p1cardsAll[0])
                p1cardsAll = removeItem(p1cardsAll,p1cardsAll[0])
            }
            let p1 = {
                member:message.member,
                vie:100,
                viemax:100,
                mana:100,
                manamax:100,
                atk:10,
                def:0,
                thorns:0,
                skills: p1cardsunit,
                buffs: [],
                debuffs: [],
                canatk:true,
                candef:true,
                canusecard:true
            }
            let count = 0
            let p2cardsAll = i18n.i(cards.filter(x => p2inventory.filter(x=> objects.find(i => i.id==x).card).includes(x.id)),guildId)
            let p2cardsunit = []
            while (p2cardsAll.length>0){
                p2cardsunit.push(p2cardsAll[0])
                p2cardsAll = removeItem(p2cardsAll,p2cardsAll[0])
            }
            let p2 = {
                member:target,
                vie:100,
                viemax:100,
                mana:100,
                manamax:100,
                atk:10,
                def:0,
                thorns:0,
                skills: p2cardsunit,
                buffs: [],
                debuffs: [],
                canatk:true,
                candef:true,
                canusecard:true
            }
            let tour = p1
            let other = p2
            const EmbedFeed = new MessageEmbed()
                .setColor('DARK_BUT_NOT_BLACK')
                .setDescription(i18n.t("commands.fun.fight.turn",guildId,{user:tour.member.displayName}))
            setMessage(message, p1, p2, tour, other, undefined, EmbedFeed)
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
        
        async function setMessage(message, p1, p2 ,tour,other, botmessage, EmbedFeed){ // Send or update the bot's message with infos about players
            if(p1==tour){
                count ++
            }
            let EmbedTour = new MessageEmbed()
                    .setDescription(i18n.t("commands.fun.fight.turn",guildId,{user:tour.member.displayName}))
                    .setColor(tour == p1 ? 'BLUE' : 'GOLD');
            let EmbedBody = new MessageEmbed()
                .addFields(
                { name: p1.member.displayName ,value:i18n.t("commands.fun.fight.body",guildId,{hp:p1.vie,mana:p1.mana,atk:p1.atk,def:p1.def}),inline:true},
                //{ name:"  Contre  ",value:"_ _ _ _\n-------\n-------",inline:true},
                {name : '\u200b', value:'\u200b',inline:true},
                { name: p2.member.displayName ,value:i18n.t("commands.fun.fight.body",guildId,{hp:p2.vie,mana:p2.mana,atk:p2.atk,def:p2.def}),inline:true}
                )
                .setColor('DARK_BLUE')
                .setFooter({text:i18n.t("commands.fun.fight.count",guildId,{count:count})});
        
            let row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('atk')
                            .setLabel(i18n.t("commands.fun.fight.buttons.atk",guildId))
                            .setStyle('SECONDARY')
                            .setEmoji('⚔️')
                            .setDisabled(!tour.canatk),
                        new MessageButton()
                            .setCustomId('skill')
                            .setLabel(i18n.t("commands.fun.fight.buttons.skill",guildId))
                            .setStyle('SECONDARY')
                            .setEmoji('🃏')
                            .setDisabled(!(Boolean(tour.skills.length) && tour.canusecard)),
                        new MessageButton()
                            .setCustomId('def')
                            .setLabel(i18n.t("commands.fun.fight.buttons.def",guildId))
                            .setStyle('SECONDARY')
                            .setEmoji('🛡️')
                            .setDisabled(!tour.candef),
                        new MessageButton()
                            .setCustomId('giveup')
                            .setLabel(i18n.t("commands.fun.fight.buttons.giveup",guildId))
                            .setStyle('DANGER'),
                    )
            await wait(300)
            if(botmessage == undefined){
            message.channel.send({embeds:[EmbedTour, EmbedBody, EmbedFeed], components: [row]})
                .then(ms => {
                    startCollector(message, p1, p2, tour, other, ms, 0, EmbedBody, EmbedTour,EmbedFeed, row)
                    return;
                })
            }else{
                botmessage.edit({embeds:[EmbedTour,EmbedBody,EmbedFeed], components: [row]})
                    .then(ms=> {
                        startCollector(message, p1, p2, tour, other, botmessage, 0, EmbedBody, EmbedTour,EmbedFeed, row)
                        return;
                    })
            }
        }   
        
        function startCollector(message, p1, p2, tour, other, botmessage, initialTimer, EmbedBody, EmbedTour,Embed, row){ // Collect interactions from buttons
            const filter = i => ['atk','skill','def', 'giveup'].includes(i.customId) && [tour.member, other.member].includes(i.member)
        
            const collector = message.channel.createMessageComponentCollector({ filter, time: 60_000 - initialTimer});
            let timer = Date.now()
            let fullfilled = false
        
            botmessage.edit({embeds:[EmbedTour,EmbedBody,Embed], components: [row]})
            let EmbedFeed = new MessageEmbed()
                .setColor('DARK_BUT_NOT_BLACK')
                .setDescription(i18n.t("commands.fun.fight.timeout",guildId,{user:tour.member.displayName}));
        
            collector.on('collect', async i => {
                if(i.message.id === botmessage.id){
                    if(i.member == tour.member){
                        switch (i.customId){
                            case 'atk':
                                const damages = tour.atk*getRandomInt(80,110)/100
                                const blocked = Math.min(getRandomInt(10,60)/100*other.def, getRandomInt(30,60)/100*8+getRandomInt(1,10)/100*other.def)
                                const blockedself = Math.min(getRandomInt(10,60)/100*tour.def, getRandomInt(30,60)/100*8+getRandomInt(1,10)/100*tour.def)
                                if(damages >= blocked){
                                    other.vie = Number((other.vie - (damages-blocked)).toFixed(2))
                                }
                                if(damages*other.thorns>=blockedself*other.thorns){
                                    tour.vie = Number((tour.vie - (damages*other.thorns-blockedself*other.thorns)).toFixed(2))
                                }
                                i.deferUpdate()
                                console.log(i18n.t("commands.fun.fight.feed.atk.main",guildId,{user:tour.member.displayName, damages:((damages-blocked)>=0 ? (damages-blocked).toFixed(2) : '0')}) + (damages*other.thorns>blockedself ? i18n.t("commands.fun.fight.feed.atk.sub",guildId,{user:tour.member.displayName,damages:(damages*other.thorns-blockedself).toFixed(2)}) : ''))
                                EmbedFeed
                                    .setColor('ORANGE')
                                    .setDescription(i18n.t("commands.fun.fight.feed.atk.main",guildId,{user:tour.member.displayName, damages:((damages-blocked)>=0 ? (damages-blocked).toFixed(2) : '0')}) + (damages*other.thorns>blockedself ? i18n.t("commands.fun.fight.feed.atk.sub",guildId,{user:tour.member.displayName,damages:(damages*other.thorns-blockedself).toFixed(2)}) : ''));
                                fullfilled = true;
                                collector.stop()
                                break;
                            case 'skill':
                                const skillsEmbed = new MessageEmbed()
                                    .setTitle(i18n.t("commands.fun.fight.skill",guildId));
                                for(a of tour.skills){
                                    skillsEmbed.addFields({name: `${a.name} (${a.mana.toString()})`, value: a.use, inline:true})
                                }
                                const skills = setSkillsComponents(tour);
                                const replymessage = await i.reply({embeds: [skillsEmbed],components: skills, fetchReply: true, ephemeral: false})
                                timer = Date.now() - timer
                                cardCollector(message, p1, p2, tour, other, botmessage, replymessage, timer, EmbedBody, EmbedTour, Embed, row)
                                fullfilled = true;
                                collector.stop()
                                break;
                            case 'def':
                                const defpoints = getRandomInt(1,3)
                                tour.def += defpoints
                                i.deferUpdate()
                                EmbedFeed
                                    .setColor('DARK_AQUA')
                                    .setDescription(i18n.t("commands.fun.fight.feed.def",guildId,{user:tour.member.displayName,def:defpoints}));
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
                        i.reply({content: i18n.t("commands.fun.fight.wrongturn",guildId), ephemeral:true})
                    }
                }
            });
        
            collector.on('end', async collected => {
                if(fullfilled){
                        const iID = collected.at(collected.size-1).customId
                    if(['def','atk'].includes(iID)){
                        nextTour(message, p1, p2, tour, other, botmessage, EmbedFeed)
                    }
                }else{
                    nextTour(message, p1, p2 ,tour, other, botmessage, EmbedFeed)
                }
            });
        }
        
        function setSkillsComponents(tour){ // Create a button for each player's skill (card)
                let skills = []
                const cancelButton = new MessageButton()
                    .setCustomId('back')
                    .setLabel(i18n.t("commands.fun.cancel",guildId))
                    .setStyle('DANGER');
                for (let a = 0; a < Math.ceil(tour.skills.length/5); a++){
                    skills.push(new MessageActionRow())
                    const max = (tour.skills.length - 5*a) > 5 ? 5 : tour.skills.length-5*a
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
        
        function nextTour(message, p1, p2 , tour, other, botmessage, EmbedFeed){ // Pass to next round
        
            tour.buffs.forEach(buff =>{
                buff[0]--
                if(buff[0]<=0){
                    switch (buff[3]){
                        case 'set':
                            tour[buff[1]] = buff[2]
                            break;
                        case 'inc':
                            tour[buff[1]] += buff[2]
                            break;
                        case 'multiply':
                            tour[buff[1]] *= buff[2]
                            break;
                        case 'divide':
                            tour[buff[1]] /= buff[2]
                            break;
                    }
                    tour.buffs.splice(tour.buffs.indexOf(buff), 1)
                }
            })
            tour.debuffs.forEach(debuff =>{
                debuff[0]--
                if(debuff[0]<=0){
                    switch (debuff[3]){
                        case 'set':
                            tour[debuff[1]] = debuff[2]
                            break;
                        case 'inc':
                            tour[debuff[1]] += debuff[2]
                            break;
                        case 'multiply':
                            tour[debuff[1]] *= debuff[2]
                            break;
                        case 'divide':
                            tour[debuff[1]] /= debuff[2]
                            break;
                    }
                    tour.debuffs.splice(tour.debuffs.indexOf(debuff), 1)
                }
            })
        
        
            p1=[tour,other].find(x=>x.member == p1.member)
            p2=[tour,other].find(x=>x.member==p2.member)
            const oldtour = tour
            tour = other
            other = oldtour
            tour.mana += 5
            if(p1.vie>0 && p2.vie>0){
                setMessage(message,p1,p2,tour,other,botmessage,EmbedFeed)
            }else if(p1.vie<=0){
                win(p2.member, p1.member, botmessage, false)
            }else if(p2.vie<=0){
                win(p1.member, p2.member, botmessage, false)
            }
        }
        
        function cardCollector(message, p1, p2 ,tour, other, botmessage, replymessage, timer, EmbedBody, EmbedTour,EmbedFeed, row){ // Collect interactions from skills buttons 
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
                            tour.mana -= cards.find(x=>x.id==i.customId).mana
                            tour.skills = removeItem(tour.skills, cards.find(x=> x.id ==i.customId))
                            EmbedFeed
                                .setColor('DARK_PURPLE')
                                .setDescription(i18n.t("commands.fun.fight.feed.skill",guildId,{user:tour.member.displayName,card:i18n.i(i.customId,guildId).name}));
                            nextTour(message, p1, p2, tour, other, botmessage,EmbedFeed)
                            //i.deferUpdate()
                            collector.stop()
                        }else{
                            startTime = (Date.now() - startTime) + timer
                            fullfilled = true
                            startCollector(message, p1, p2, tour, other, botmessage, startTime, EmbedBody, EmbedTour,EmbedFeed, row)
                            collector.stop()
                        }
                    }else{
                        i.reply({content: i18n.t("commands.fun.fight.wrongturn",guildId), ephemeral:true})
                    }
                }
            });
        
            collector.on('end', async collected => {
                if(!fullfilled){
                    EmbedFeed = new MessageEmbed()
                        .setColor('DARK_BUT_NOT_BLACK')
                        .setDescription(i18n.t("commands.fun.fight.timeout",guildId,{user:tour.member.displayName}));
                    replymessage.delete()
                    nextTour(message, p1, p2, tour, other, botmessage, EmbedFeed)
                }
                replymessage.delete()
            });
        }
        
        function win(winner,looser, botmessage, forfait){ // Update the bot message to announce the winner (and the looser)
            const forfaitSTR = forfait ? i18n.t("commands.fun.fight.withdraw",guildId) : i18n.t("highpunctuation",guildId)
            const Embed = new MessageEmbed()
                .setDescription(i18n.t("commands.fun.fight.win",guildId,{winner:winner.displayName,looser:looser.displayName,withdraw:forfaitSTR}))
                .setThumbnail(winner.user.displayAvatarURL());
            botmessage.edit({embeds:[Embed], components:[]})
            cooldown.delete(winner.user.id)
            cooldown.delete(looser.user.id)
            count = 0
        }
    }   
}
