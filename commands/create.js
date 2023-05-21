const mongoose = require('../database/mongoose')
const {SuperAdmin} = require('../config.json')
const {i18n} = require('../i18n/i18n')
module.exports = {
    name:'create',
    category: "Admin",
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
                            message.reply(`Inventory created for ${user.tag}`)
                        }
                        if(doc === true){ //case yes
                            console.log(`${user.tag} already has inventory!`)
                            message.reply(`${user.tag} already has inventory!`)
                        }
                    }
                });
            }else{
                message.reply(i18n.t("commands.interaction.missingmention",message.guildId))
            }
        }
    }
}
