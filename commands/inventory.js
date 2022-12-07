const maths = require('../maths');
const mongoose = require('../database/mongoose')
const Discord = require('discord.js')
const objects = require('../database/objects.json')
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
            mongoose.Inventory.exists({user: member.user.id},async function (err,doc){
                if(err){
                    console.log(err)
                }else{
                    if(doc === false){
                        message.reply("Vous n'avez pas d'inventaire (Récupérez un objet ou rendez-vous dans le magasin pour pouvoir l'afficher)")
                    }
                    if(doc === true){
                        const element = await mongoose.Inventory.findOne({ user: member.user.id} );
                        let powerups = []
                        element.inventory.sort((a,b) => a-b)
                        const Embed = new Discord.MessageEmbed()
                            .setTitle(`Inventaire de ${member.displayName}`)
                            .setColor('ffd700')
                            .setDescription(`Argent : ${element.money} :coin:`);
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
 