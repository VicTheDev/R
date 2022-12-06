/*const { MessageEmbed } = require('discord.js');
const {Inventory, Profile} = require('../database/mongoose')
module.exports = {
    name: "profile",
    description: "Show your mighty profile.",
    category: "Inventory",
    execute(message, args){
        if(message.mentions.members.first() != undefined){
            const member = message.mentions.members.first()
        }else{
            const member = message.member
        }
        const element = Inventory.findOne({ user: member.user.id} );
        let Embed = new MessageEmbed()
            setTitle(``)
    }
}*/