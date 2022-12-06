const {MessageActionRow ,MessageButton} = require('discord.js')
const { getRandomInt } = require('../maths')
const cooldown = new Set();
module.exports = {
    name:"duel",
    description:"Be the quicker to shoot at your oponent",
    category:"Fun",
    async execute(message,args){
        const member = message.member;
        const target = message.mentions.members.first()
        if(target != undefined){
            if(!cooldown.has(member.user.id)){
                if(!cooldown.has(target.user.id)){
                    cooldown.add(member.user.id)

                    message.delete()

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('ok')
                                .setLabel('Accept')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('no')
                                .setLabel('Decline')
                                .setStyle('DANGER')
                        );

                    const acceptmessage = await message.channel.send({content:`${member.user} challenged ${target.user} to a duel!`, components: [row]})
                    const filter = i => i.message.id == acceptmessage.id && ['ok','no'].includes(i.customId) && i.member == target;
                    const collector = acceptmessage.channel.createMessageComponentCollector({filter, time: 20_000});
                    
                    let answered = false
                    collector.on('collect', async i => {
                        switch (i.customId){
                            case 'ok':
                                await acceptmessage.edit({content:`${target.user} accepted the duel! It will start in a few seconds...`, components: []})
                                cooldown.add(target.user.id)
                                setTimeout(() => {
                                    acceptmessage.delete()
                                    duel(message, member, target)
                                }, 3000)
                                answered = true
                                collector.stop()
                                break;
                            case 'no':
                                await acceptmessage.edit({content: `${target.displayName} declined the duel.` , components: []})
                                cooldown.delete(member.user.id)
                                answered = true
                                setTimeout(() => {
                                    acceptmessage.delete()
                                }, 3000)
        
                        }
                    })
        
                    collector.on('end', async collected => {
                        if(!answered){
                            await acceptmessage.edit({content: `${target.displayName} declined the duel.` , components: []})
                            cooldown.delete(member.user.id)
                                setTimeout(() => {
                                    acceptmessage.delete()
                                }, 3000)
                        }
                    })
                }else{
                    const reply = await message.reply(`${target.displayName} already has a duel going on!`)
                    message.delete()
                    setTimeout(() => {
                        reply.delete()
                    }, 3000)
                }
            }else{
                const reply = await message.reply('You already have a duel going on!')
                message.delete()
                setTimeout(() => {
                    reply.delete()
                }, 3000)
            }
        }else{
            const reply = await message.reply("You must mention someone!")
            message.delete()
            setTimeout(() => {
                reply.delete()
            }, 3000)
        }
    }
        
}

async function duel(message, member, target){
    const players = [member.user.id, target.user.id]
    const lose = [target.user.id, member.user.id]
    const pos = [
        '_ _  :grinning:  :point_right:           Wait           :point_left:  :grinning: _ _',
        '_ _  :grinning:  :point_right:           Shoot          :point_left:  :grinning: _ _',
        `_ _  :cowboy:           ${member.displayName} won!           :skull: _ _`,
        `_ _  :skull:           ${target.displayName} won!           :cowboy: _ _`,
        `_ _  :frowning2:  :point_right:           Draw           :point_left:  :frowning2: _ _`

    ]
    let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('0')
                    .setLabel('SHOOT')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('mid')
                    .setLabel('\u200b')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId('1')
                    .setLabel('SHOOT')
                    .setStyle('DANGER')
            );
    const botmessage = await message.channel.send({content: pos[0], components: [row]});

    const filter = i => ['0','1'].includes(i.customId) && [member, target].includes(i.member) && i.message.id == botmessage.id
    const collector = botmessage.channel.createMessageComponentCollector({ filter, time: 20_000})
    
    let canShoot = false
    let end = false
    const timer = getRandomInt(1000, getRandomInt(4500, 5250))

    setTimeout(() => {
        if(!end){
            canShoot = true
        botmessage.edit({content: pos[1], components: [row]})
        }    
    }, timer)

    collector.on('collect', async i => {
        if(canShoot){
            end = true
            await botmessage.edit({content: pos[2 + players.indexOf(i.member.user.id)] , components:[]})
            collector.stop()
        }else{
            end = true
            i.reply({content: 'Vous avez tiré trop tôt !', ephemeral: true})
            await botmessage.edit({content: pos[2 + lose.indexOf(i.member.user.id)] , components:[]})
            collector.stop()
        }
    })

    collector.on('end', async collected => {
        if(!end){
            await botmessage.edit({content: pos[4], components:[]})
        }
        cooldown.delete(member.user.id)
        cooldown.delete(target.user.id)

    })
}