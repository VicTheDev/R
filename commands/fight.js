const Discord = require('discord.js')
const wait = require('util').promisify(setTimeout);
const {getInventory1} = require('../fightsys');
const {MessageActionRow, MessageButton} = require('discord.js')
const cooldown = new Set();
module.exports = {
    name: "fight",
    description: "Start a fight",
    category: "Fun",
	async execute(message, args) {
        /*const target = message.mentions.members.first()
        if(target!== undefined){
            getInventory1(message, target)
        }else{
            message.reply({content: "You must mention someone!"})
        }*/

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

                    const acceptmessage = await message.channel.send({content:`${member.user} challenged ${target.user} to a fight!`, components: [row]})
                    const filter = i => i.message.id == acceptmessage.id && ['ok','no'].includes(i.customId) && i.member == target;
                    const collector = acceptmessage.channel.createMessageComponentCollector({filter, time: 20_000});
                    
                    let answered = false
                    collector.on('collect', async i => {
                        switch (i.customId){
                            case 'ok':
                                await acceptmessage.edit({content:`${target.user} accepted the fight! It will start in a few seconds...`, components: []})
                                cooldown.add(target.user.id)
                                setTimeout(() => {
                                    acceptmessage.delete()
                                    getInventory1(message,target)
                                }, 3000)
                                answered = true
                                collector.stop()
                                break;
                            case 'no':
                                await acceptmessage.edit({content: `${target.member.displayName} declined the fight.` , components: []})
                                cooldown.delete(member.user.id)
                                answered = true
                                setTimeout(() => {
                                    acceptmessage.delete()
                                }, 3000)
        
                        }
                    })
        
                    collector.on('end', async collected => {
                        if(!answered){
                            await acceptmessage.edit({content: `${target.member.displayName} declined the fight.` , components: []})
                            cooldown.delete(member.user.id)
                                setTimeout(() => {
                                    acceptmessage.delete()
                                }, 3000)
                        }
                    })
                }else{
                    const reply = await message.reply(`${target.displayName} is already fighting!`)
                    message.delete()
                    setTimeout(() => {
                        reply.delete()
                    }, 3000)
                }
            }else{
                const reply = await message.reply('You are already in a fight!')
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