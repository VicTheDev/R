const mongoose = require('../database/mongoose')
module.exports = {
	name: 'transfer',
	description: 'Send money to another person.',
	execute(message, args) {
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
                            message.reply("Vous n'avez pas d'inventaire !")
                        }

                        if(doc === true){
                            mongoose.Inventory.exists({user: target.user.id},async function (err,doc){  //Check if receiver has inventory
                                if(err){
                                    console.log(err)
                                }else{
                                    if(doc === false){
                                        message.reply("Le destinataire n'a pas d'inventaire !")
                                    }

                                    if(doc === true){   //Updating inventories
                                        const sender = await mongoose.Inventory.findOne({user: message.author.id})
                                        const receiver = await mongoose.Inventory.findOne({user: target.user.id})
                                        if(sender.money>=amount){
                                            sender.money = sender.money - amount
                                            receiver.money = receiver.money + amount
                                            await sender.save()
                                            await receiver.save()
                                            message.reply(`${amount} :coin: transférés à ${target.displayName}`)
                                        }else{
                                            message.reply("Vous n'avez pas assez d'argent !")
                                        }
                                    }
                                }
                
                            });
                        }
                    }
    
                });
            }else{
                message.reply({content: 'Veuillez sélectionner un montant valide !'})
            }
            
        }else{
            message.reply({content: 'Vous devez mentionner une personne !'})
        }
            
	}, 
};
