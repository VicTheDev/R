const maths = require('../maths');
const mongoose = require('../database/mongoose')
const Discord = require('discord.js')
const objects = require('../database/objects.json')
module.exports = {
	name: 'inventory',
	description: 'Get Items in your inventory',
	execute(message, args) {
            mongoose.Inventory.exists({user: message.member.id},async function (err,doc){
                if(err){
                    console.log(err)
                }else{
                    if(doc === false){
                        message.reply("Vous n'avez pas d'inventaire (Récupérez un objet pour pouvoir l'afficher)")
                    }
                    if(doc === true){
                        const element = await mongoose.Inventory.findOne({ user: message.member.id} );
                        let powerups = []
                        element.inventory.sort((a,b) => a-b)
                        const Embed = new Discord.MessageEmbed()
                            .setTitle(`Inventaire de ${message.member.displayName}`);
                        while (element.inventory.length>0){
                            powerups.push([element.inventory[0],element.inventory.filter(x => x==element.inventory[0]).length])
                            element.inventory = maths.removeItem(element.inventory,element.inventory[0])
                        }
                        powerups.forEach(function(item){
                            console.log(item)
                            Embed.addField(objects[item[0]].name,`x${item[1]}`,true)
                        })
                        message.channel.send(Embed)
                    }
                }

            });
	}, 
};
