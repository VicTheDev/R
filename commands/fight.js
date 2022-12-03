const Discord = require('discord.js')
const wait = require('util').promisify(setTimeout);
const {getInventory1} = require('../fightsys');
module.exports = {
    name: "fight",
    description: "Start a fight",
    category: "Fun",
	async execute(message, args) {
        const target = message.mentions.members.first()
        if(target!== undefined){
            getInventory1(message, target)
        }else{
            message.reply({content: "You must mention someone!"})
        }
	},
};