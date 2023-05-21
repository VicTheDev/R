const maths = require('../maths');
const { snowman } = require('../LocalStorage')
const Discord = require('discord.js')
const cooldown = new Set();
const wait = require('util').promisify(setTimeout);
const mongoose = require('../database/mongoose')
const items = require('../database/objects.json')
const {i18n} = require('../i18n/i18n')

module.exports = {
	name: 'snowman',
    category: "Fun",
	async execute(message, args) {
        const guildId = message.guildId
        const objects = i18n.i(items,guildId)
        if(!cooldown.has(message.guildId)){
            cooldown.add(message.guildId)
            let Embed = new Discord.MessageEmbed()
                .setDescription(i18n.t("commands.fun.snowman.embed.description",guildId))
                .setFooter({text:`Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })})
                .setColor('fffffe');

            const botmessage = await message.channel.send({embeds: [Embed]})
            message.delete()
            await botmessage.react('⛄')

            const filter = (reaction, user) => {
                return ['⛄','🔧','❄️'].includes(reaction.emoji.name) && reaction.message.id === botmessage.id && !user.bot;
            };

            let list = [[],[]]
            let powerup = []
            let size = 0
            const collector = botmessage.createReactionCollector({filter, time: 24000 });
            collector.on('collect', (reaction, user) => {
                if(reaction.emoji.name === '⛄' && !list[0].includes(user)){
                    list[0].push(user)
                    list[1].push(user.tag)
                    if(Embed.fields.length<25){
                        Embed.addField(user.tag,i18n.t("commands.fun.snowman.embed.joined",guildId),true)
                    }
                    botmessage.edit({embeds: [Embed]})
                    size = size + 1
                


                }else{
                    const item = ['🔧','❄️'].indexOf(reaction.emoji.name)
                    if(list[0].includes(user)){
                        mongoose.Inventory.exists({user: user.id},async function (err,doc){
                            if(err){
                                console.log(err)
                            }else{
                                if(doc === true){
                                    if(!powerup.includes(user.tag)){
                                        const element = await mongoose.Inventory.findOne({ user: user.id});
                                        if(element.inventory.includes(item)){
                                            powerup.push(user.tag)
                                            if(Embed.fields.length<25){
                                                Embed.addField(user.tag,i18n.t("commands.fun.snowman.embed.powerup",guildId,{power:objects[item].name}),true)
                                            }
                                            botmessage.edit({embeds: [Embed]})
                                            size = size + objects[item].effect
                                            var index = element.inventory.indexOf(item);
                                            if (index !== -1) {
                                                await element.inventory.splice(index, 1);
                                                await element.save();   
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }



            });
            



            collector.on('end', collected => {
                Embed.fields = null
                if(list[0].length<2){
                    if(list[0].length===0){
                    Embed.setDescription(i18n.t("commands.fun.snowman.embed.endings.noone",guildId)`Personne n'a construit ce magnifique bonhomme de neige.\n*Rassemble plus de personnes pour l'améliorer*`)
                    }else{
                        Embed.setDescription(i18n.t("commands.fun.snowman.embed.endings.one",guildId,{user:list[1][0]}))
                    }
                }else{
                    Embed.setDescription(i18n.t("commands.fun.snowman.embed.endings.one",guildId,{users:list[1].slice(0,list[1].length-1).join(', '),user:list[1][list[1].length-1]}))
                }
                if(size>=snowman.length-1){
                    size = snowman.length - 1
                    Embed.setAuthor({name: i18n.t("commands.fun.snowman.embed.endings.max",guildId)})
                }
                Embed.setImage(snowman[size])
                if(maths.getPercentage(15)){
                    const user = list[0][maths.getRandomInt(0,list[0].length)]
                    mongoose.Inventory.exists({user: user.id},async function (err,doc){
                        if(err){
                            console.log(err)
                        }else{
                            if(doc === false){
                                const doc = mongoose.Inventory.create({
                                    user: user.id, 
                                    inventory: [maths.getRandomInt(0,1)]
                                });
                                doc.save;
                                console.log('Inventory created')
                            }
                            if(doc === true){
                                const gift = maths.getRandomInt(0,1)
                                await mongoose.Inventory.findOneAndUpdate(
                                    { user: user.id},
                                    { $push: { inventory: gift}})
                                botmessage.channel.send({content: i18n.t("commands.fun.snowman.gift",guildId,{user:user.tag,item:objects[gift].name})})
                            }
                        }
        
                    });
                }
                botmessage.edit({embeds: [Embed]})
                botmessage.reactions.removeAll()
                cooldown.delete(message.guildId)
            });
        }else{
            const rep = await message.reply(i18n.t("commands.fun.snowman.cooldown",guildId))
            message.delete()
            await wait(3000)
            rep.delete();
        }
	}, 
};