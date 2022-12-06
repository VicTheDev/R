const { MessageEmbed } = require('discord.js');
const {Inventory, Profile} = require('../database/mongoose')
const {getRandomInt} = require('../maths')
module.exports = {
    name: "daily",
    description: "Claim your daily gift",
    category: "Inventory",
    async execute(message, args){
        let user = message.author
        Inventory.exists({ user: user.id }, async function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                if (doc === false) {
                    let element = await Inventory.create({
                        user: user.id,
                        inventory: [],
                        money: 0,
                        daily: Date.now()
                    });
                    await element.save();
                    element = element.toObject();
                    console.log('Inventory created');
                    getDaily(message,element,user)
                }
                if (doc === true) {
                    let element = await Inventory.findOne({ user: user.id });
                    element = element.toObject();
                    getDaily(message,element,user)
                }
            }
        });
    }
}
async function getDaily(message, element, user){
    if(element.daily == undefined){
        await Inventory.findOneAndUpdate({user:user.id}, { $set: {daily:Date.now()}})
        element.daily=Date.now()
        getGift(message, user)
    }else if(Date.now() - element.daily >= (24*3600*1000)){
        getGift(message, user)
    }else{
        const timeremain = (24*3600*1000) - (Date.now() - element.daily)
        const hours = Math.floor(timeremain/1000/3600)
        const minutes = Math.floor(timeremain/1000/60 - hours*60)
        const seconds = Math.round(timeremain/1000 - minutes*60 - hours*3600)
        const Embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setDescription(`**Vous avez déjà réclamé votre récompense journalière !**\n`)
            .setFooter({text: `Revenez dans ${hours} heures ${minutes} minutes et ${seconds} secondes`})
        message.reply({embeds: [Embed]})
    }
}
async function getGift(message, user){
    const win = getRandomInt(5,15)
    await Inventory.findOneAndUpdate({user:user.id}, { $inc: {money: win}})
    const Embed = new MessageEmbed()
        .setColor('DARK_GOLD')
        .setDescription(`${user.username} a réclamé sa récompense journalière de \`${win}\` pièces !`)
    message.channel.send({embeds: [Embed]})
}