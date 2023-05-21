const { MessageEmbed } = require('discord.js');
const {Inventory, Profile} = require('../database/mongoose')
const {getRandomInt} = require('../maths')
const {i18n} = require('../i18n/i18n')
module.exports = {
    name: "daily",
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
    const guildId = message.guildId
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
            .setDescription(i18n.t("commands.inventory.daily.unavailable.description",guildId))
            .setFooter({text: i18n.t("commands.inventory.daily.unavailable.footer",guildId,{hours:hours,minutes:minutes,seconds:seconds})})
        message.reply({embeds: [Embed]})
    }
}
async function getGift(message, user){
    const win = getRandomInt(8,20)
    await Inventory.findOneAndUpdate({user:user.id}, { $inc: {money: win}, $set: {daily:Date.now()}})
    const Embed = new MessageEmbed()
        .setColor('DARK_GOLD')
        .setDescription(i18n.t("commands.inventory.daily.claimed",guildId,{user:user.username,win:win}))
    message.channel.send({embeds: [Embed]})
}