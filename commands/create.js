const mongoose = require('../database/mongoose')
const {SuperAdmin} = require('../config.json')
module.exports = {
    name:'create',
    description:'Used to create an inventory',
    category: "Admin",
    use:"`!create <user>` - Crée un inventaire pour l'utilisateur mentionné",
    example:"`!create @Vic`",
    async execute(message, args) {
        if(message.author.id==SuperAdmin){ //Check if the user has the permission to manage inventories
            if(message.mentions.users.first()!==undefined){
                let user = message.mentions.users.first()  
                mongoose.Inventory.exists({user: user.id}, async function (err,doc){ //Check if mentionned user has inventory
                    if(err){
                        console.log(err)
                    }else{
                        if(doc === false){ //case no
                            console.log(`Creating inventory for ${user.tag}`)
                            const element = await mongoose.Inventory.create({
                                user: user.id, 
                                inventory: [],
                                money: 0
                            });
                            await element.save();
                            console.log('Inventory created')
                            message.reply(`Inventaire créé pour ${user.tag}`)
                        }
                        if(doc === true){ //case yes
                            console.log(`${user.tag} already has inventory!`)
                            message.reply(`${user.tag} a déjà un inventaire !`)
                        }
                    }
                });
            }else{
                message.reply("Vous devez mentionner quelqu'un !")
            }
        }
    }
}
