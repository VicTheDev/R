const Discord = require('discord.js');
const wait = require('util').promisify(setTimeout);
module.exports = {
    name:'baton',
    description:"Don't take the last stick !",
    async execute(message,args){
            const target = message.mentions.members.first()
            const member = message.member
            let tour = 0
            let chrono = [[0],[0]]
            const players = [member,target]
            message.delete()
            if(target!== undefined && target!==member){
                let list = [':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:',':wood:']
                const Embed = new Discord.MessageEmbed()
                    .setAuthor('Jeu des bâtons')
                    .setDescription(`**${message.member.displayName}** VS **${target.displayName}**`)
                    .addFields(
                        {name:'Ne prenez pas le dernier bâton !',value:`**${list.join(' ')}** — ${list.length} bâtons restant`},
                        {name:'Tour',value:`C'est au tour de : **${players[tour].displayName}**`}
                    )
                    .setColor('ff7f00')
                const botmessage = await message.channel.send(Embed)
                await botmessage.react('1️⃣')
                await botmessage.react('2️⃣')
                await botmessage.react('3️⃣')
                const opt = ['1️⃣','2️⃣','3️⃣']
                const filter = (reaction, user) => {
                    return opt.includes(reaction.emoji.name) && reaction.message.id === botmessage.id
                };

                let time = Date.now() 

                const collector = botmessage.createReactionCollector(filter,{time:120_000})

                collector.on('collect', async (reaction,user) =>{
                    reaction.users.remove(user)
                    if(user.tag===players[tour].user.tag){
                        chrono[tour].push(Date.now()-time)
                        time = Date.now()
                        list.splice(0,opt.indexOf(reaction.emoji.name)+1)
                        Embed.fields[0] = {name:'Ne prenez pas le dernier bâton !',value:`**${list.join(' ')}** — ${list.length} bâtons restant`}
                        tour = tour +1
                        if(tour>1)tour = 0;
                        Embed.fields[1] = {name:'Tour',value:`C'est au tour de : **${players[tour].displayName}**`}
                        botmessage.edit(Embed)
                        if(list.length<2){
                            if(list.length===1){
                                tour = tour +1
                                if(tour>1)tour = 0;
                            }
                            Embed.fields = []
                            Embed.setDescription(`**${players[tour].displayName}** a gagné !`)
                            await botmessage.reactions.removeAll()
                            botmessage.edit(Embed)
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
                        Embed.setDescription(`**${players[chronotest.indexOf(Math.min(...chronotest))].displayName}** a gagné (Temps écoulé)!`)
                        await botmessage.reactions.removeAll()
                        botmessage.edit(Embed)
                    }
                })




            }else{
                if(target===member){
                    const botreply = await message.reply('Vous ne pouvez pas jouer contre vous même')
                    await wait(4000)
                    botreply.delete()
                }else if(target===undefined){
                    const ErrorBetonEmbed = new Discord.MessageEmbed()
                                .setColor("#ef5350")
                                .setTitle("Commande Baton")
                                .setDescription("Vous devez mentionnez un utilisateur pour utiliser cette commande.\n\n**Usage**\n`!baton <target>`\n\n**Example Usage**\n`!baton @R2-D2`\n")
                                .setFooter("Catégorie de commande: Fun");
                    message.channel.send(ErrorBetonEmbed)
                }
            }
    },
}