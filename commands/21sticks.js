const Discord = require('discord.js');
const wait = require('util').promisify(setTimeout);
const {i18n} = require('../i18n/i18n')
const {PREFIX} = require('../config.json')
const {getRandomInt,capitalizeFirstLetter} = require('../maths')
const {ErrorEmbed} = require('../errorembed')
module.exports = {
    name:'21sticks',
    category: "Fun",
    async execute(message,args){
            const guildId = message.guildId;
            const target = message.mentions.members.first()
            const member = message.member
            let tour = getRandomInt(0,1);
            let chrono = [[0],[0]]
            const players = [member,target]
            message.delete()
            if(target!== undefined && target!==member){
                let list = Array(21).fill('wood');
                const Embed = new Discord.MessageEmbed()
                    .setAuthor({name: i18n.t("commands.fun.21sticks.game",guildId)})
                    .setDescription(`**${message.member.displayName}** VS **${target.displayName}**`)
                    .addFields(
                        {name:i18n.t("commands.fun.21sticks.description",guildId),value:`**${list.join(' ')}** — ${list.length} ${i18n.t("commands.fun.21sticks.remain",guildId)}`},
                        {name:i18n.t("commands.fun.21sticks.turn",guildId),value:i18n.t("commands.fun.21sticks.turnvalue",guildId,{user:players[tour].displayName})}
                    )
                    .setColor('ff7f00')
                const botmessage = await message.channel.send({embeds: [Embed]})
                await botmessage.react('1️⃣')
                await botmessage.react('2️⃣')
                await botmessage.react('3️⃣')
                const opt = ['1️⃣','2️⃣','3️⃣']
                const filter = (reaction, user) => {
                    return opt.includes(reaction.emoji.name) && reaction.message.id === botmessage.id
                };

                let time = Date.now() 

                const collector = botmessage.createReactionCollector({filter, time:120_000})

                collector.on('collect', async (reaction,user) =>{
                    reaction.users.remove(user)
                    if(user.tag===players[tour].user.tag){
                        chrono[tour].push(Date.now()-time)
                        time = Date.now()
                        list.splice(0,opt.indexOf(reaction.emoji.name)+1)
                        Embed.fields[0] = {name:i18n.t("commands.fun.21sticks.description",guildId),value:`**${list.join(' ')}** — ${list.length} ${i18n.t("commands.fun.21sticks.remain",guildId)}`}
                        tour = tour +1
                        if(tour>1)tour = 0;
                        Embed.fields[1] = {name:i18n.t("commands.fun.21sticks.turn",guildId),value:i18n.t("commands.fun.21sticks.turnvalue",guildId,{user:players[tour].displayName})}
                        try {
                            botmessage.edit({embeds: [Embed]})
                        } catch (error){
                            console.error('Message was deleted')
                        }
                        if(list.length<2){
                            if(list.length===1){
                                tour = tour +1
                                if(tour>1)tour = 0;
                            }
                            Embed.fields = []
                            Embed.setDescription(i18n.t("commands.fun.21sticks.win",guildId,{user:players[tour].displayName}))
                            try {
                                await botmessage.reactions.removeAll()
                                botmessage.edit({embeds: [Embed]})
                            } catch (error){
                                console.error('Message was deleted')
                            }
                            collector.stop()
                        }   
                    }
                })

                collector.on('end', async collected =>{
                    if(list.length>1){
                        chrono[tour].push(Date.now()-time)
                        const reducer = (previousValue, currentValue) => previousValue + currentValue;
                        const chronotest = [chrono[0].reduce(reducer),chrono[1].reduce(reducer)]
                        Embed.fields = []
                        Embed.setDescription(i18n.t("commands.fun.21sticks.timeout",guildId,{user:players[chronotest.indexOf(Math.min(...chronotest))].displayName}))
                        try {
                            await botmessage.reactions.removeAll()
                            botmessage.edit({embeds: [Embed]})
                        } catch (error){
                            console.error('Message was deleted')
                        }
                    }
                })




            }else{
                if(target===member){
                    const botreply = await message.reply(i18n.t("commands.fun.21sticks.opponentmissing",guildId))
                    await wait(4000)
                    try {
                        botreply.delete()
                    } catch (error){
                        console.error('Message was deleted')
                    }
                }else if(target===undefined){
                    message.channel.send(ErrorEmbed({name:this.name,category:this.category},guildId))
                }
            }
    },
}