const maths = require('../maths');
const mongoose = require('../database/mongoose')
const Discord = require('discord.js')
const objects = require('../database/objects.json')
const {SuperAdmin} = require('../config.json')
module.exports = {
	name: 'gift',
	description: 'Get Items in your inventory',
	execute(message, args) {
        if(message.author.id==SuperAdmin){
            if(parseInt(args[0], 10)<objects.length){
                mongoose.Inventory.exists({user: message.author.id},async function (err,doc){
                    if(err){
                        console.log(err)
                    }else{
                        if(doc === false){
                            const doc = mongoose.Inventory.create({
                                user: message.author.id, 
                                inventory: [parseInt(args[0],10)],
                                money: 0
                            });
                            doc.save();
                            console.log('Inventory created')
                        }
                        if(doc === true){
                            await mongoose.Inventory.findOneAndUpdate(
                                { user: message.author.id},
                                { $push: { inventory: [parseInt(args[0],10)]}}
                            )
                            console.log('Inventory Updated')
                        }
                    }

                });
            }
        }
	}, 
};
