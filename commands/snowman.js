const maths = require('../maths');
const { snowman } = require('../LocalStorage')
const Discord = require('discord.js')
const cooldown = new Set();
const wait = require('util').promisify(setTimeout);
const mongoose = require('../database/mongoose')
const objects = require('../database/objects.json')

module.exports = {
	name: 'snowman',
	description: 'Work in team to build the better snowman',
	async execute(message, args) {
        if(!cooldown.has('snowman')){
            cooldown.add('snowman')
            let Embed = new Discord.MessageEmbed()
                .setDescription('**Réunis le plus de personnes dans le temps imparti afin de bâtir le meilleur bonhomme de neige !**\n*Réagis avec :snowman: pour rejoindre la construction*')
                .setFooter(`Requested by ${message.member.displayName} (${message.author.tag})`, message.author.displayAvatarURL({ format: 'png' }))
                .setColor('fffffe');

            const botmessage = await message.channel.send(Embed)
            message.delete()
            await botmessage.react('⛄')

            const filter = (reaction, user) => {
                return ['⛄','🔧','❄️'].includes(reaction.emoji.name) && reaction.message.id === botmessage.id;
            };

            let list = [[],[]]
            let powerup = []
            let size = 0
            const collector = botmessage.createReactionCollector( filter,{time: 24_000 });
            collector.on('collect', (reaction, user) => {
                if(reaction.emoji.name === '⛄' && !list[0].includes(user)){
                    list[0].push(user)
                    list[1].push(user.tag)
                    if(Embed.fields.length<25){
                        Embed.addField(user.tag,'a rejoint la construction',true)
                    }
                    botmessage.edit(Embed)
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
                                                Embed.addField(user.tag,`a utilisé le PowerUp "${objects[item].name}"`,true)
                                            }
                                            botmessage.edit(Embed)
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
                    Embed.setDescription(`Personne n'a construit ce magnifique bonhomme de neige.\n*Rassemble plus de personnes pour l'améliorer*`)
                    }else{
                        Embed.setDescription(`**${list[1][0]}** a construit ce magnifique bonhomme de neige.\n*Rassemble plus de personnes pour l'améliorer*`)
                    }
                }else{
                    Embed.setDescription(`**${list[1].slice(0,list[1].length-1).join(', ')}** et **${list[1][list[1].length-1]}** ont construit ce magnifique bonhomme de neige.`)
                }
                if(size>=snowman.length-1){
                    size = snowman.length - 1
                    Embed.setAuthor(`Bravo pour ce travail d'équipe conséquent !`)
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
                                    inventory: [maths.getRandomInt(0,objects.length)]
                                });
                                doc.save;
                                console.log('Inventory created')
                            }
                            if(doc === true){
                                const gift = maths.getRandomInt(0,objects.length)
                                await mongoose.Inventory.findOneAndUpdate(
                                    { user: user.id},
                                    { $push: { inventory: gift}})
                                botmessage.channel.send(`**${user.tag}** a obtenu un objet : **${objects[gift].name}**`)
                            }
                        }
        
                    });
                }
                botmessage.edit(Embed)
                botmessage.reactions.removeAll()
                cooldown.delete('snowman')
            });
        }else{
            const rep = await message.reply('Un bonhomme de neige est déjà en construction !')
            message.delete()
            await wait(3000)
            rep.delete();
        }
	}, 
};