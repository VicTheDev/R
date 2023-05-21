const mongoose = require('../database/mongoose')
const {i18n} = require('../i18n/i18n')
module.exports = {
	name: 'send',
    category: "Inventory",
	execute(message, args) {
        const guildId = message.guildId;
        if(message.mentions.members.first()!==undefined && !message.mentions.members.first().user.bot){    //Check if receiver is valid
            args.shift()
            let target = message.mentions.members.first()

            let amount = parseFloat(args[0])
            if(typeof(amount) === 'number'){    //Check if amount is valid
                mongoose.Inventory.exists({user: message.author.id},async function (err,doc){   //Check if sender has inventory
                    if(err){
                        console.log(err)
                    }else{
                        if(doc === false){
                            message.reply(i18n.t("commands.inventory.inventorymissing",guildId))
                        }

                        if(doc === true){
                            mongoose.Inventory.exists({user: target.user.id},async function (err,doc){  //Check if receiver has inventory
                                if(err){
                                    console.log(err)
                                }else{
                                    if(doc === false){
                                        message.reply(i18n.t("commands.inventory.send.inventorymissing",guildId))
                                    }

                                    if(doc === true){   //Updating inventories
                                        const sender = await mongoose.Inventory.findOne({user: message.author.id})
                                        const receiver = await mongoose.Inventory.findOne({user: target.user.id})
                                        if(sender.money>=amount){
                                            sender.money = sender.money - amount
                                            receiver.money = receiver.money + amount
                                            await sender.save()
                                            await receiver.save()
                                            message.reply(i18n.t("commands.inventory.send.transferred",guildId,{amount:amount,user:target.displayName}))
                                        }else{
                                            message.reply(i18n.t("commands.inventory.send.notenoughmoney",guildId))
                                        }
                                    }
                                }
                
                            });
                        }
                    }
    
                });
            }else{
                message.reply({content: i18n.t("commands.inventory.send.invalidamount",guildId)})
            }
            
        }else{
            message.reply({content: i18n.t("commands.interaction.mentionmissing",guildId)})
        }
            
	}, 
};
