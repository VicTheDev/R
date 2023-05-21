const maths = require('../maths');
const mongoose = require('../database/mongoose')
const Discord = require('discord.js')
const {i18n} = require('../i18n/i18n')
const items = require('../database/objects.json')
module.exports = {
	name: 'inventory',
	description: 'Display inventory of given user',
    category: "Inventory",
    use: "`!inventory` - Affiche votre inventaire\n`!inventory <user>` - Affiche l'inventaire de l'utilisateur mentionné",
    example:"`!inventory`\n`!inventory @Vic`",
	execute(message, args) {
        let member
        if(message.mentions.members.first()!==undefined){
            member = message.mentions.members.first()
        }else{
            member = message.member
        }
        const guildId = message.guildId
        const objects = i18n.i(items,guildId)
        mongoose.Inventory.exists({user: member.user.id},async function (err,doc){
            if(err){
                console.log(err)
            }else{
                if(doc === false){
                    message.reply(i18n.t("commands.inventory.inventorymissing",guildId))
                }
                if(doc === true){
                    const element = await mongoose.Inventory.findOne({ user: member.user.id} );
                    let powerups = []
                    element.inventory.sort((a,b) => a-b)
                    const Embed = new Discord.MessageEmbed()
                        .setTitle(i18n.t("commands.inventory.inventory.embed.title",guildId,{user:member.displayName}))
                        .setColor('ffd700')
                        .setDescription(i18n.t("commands.inventory.inventory.embed.coin",guildId,{money:element.money}));
                    while (element.inventory.length>0){
                        powerups.push([element.inventory[0],element.inventory.filter(x => x==element.inventory[0]).length])
                        element.inventory = maths.removeItem(element.inventory,element.inventory[0])
                    }
                    powerups.forEach(function(item){
                        Embed.addField(objects[item[0]].name,`x${item[1]}`,true)
                    })
                    message.channel.send({ embeds : [Embed] });
                }
            }

        });
	}, 
};
 