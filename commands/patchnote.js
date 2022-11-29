const mongoose = require('../database/mongoose')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: 'patchnote',
    description: 'Learn about the last updates of the bot.',
    category: 'Other',
    execute(message, args) {
        if(Number.isInteger(parseInt(args[0]))){
            const patch = mongoose.Patch.findby // finir ici find by id avec id = args[0]
        }
        const patch = mongoose.Patch.find().sort({_id:-1}).limit(1)
        const Embed = new MessageEmbed()
            .setTitle(`Patch Note : ${patch.date}`)
            .setDescription(patch.content)
            .setFooter({name: `id: ${patch._id}`});
        message.channel.send({embeds: [Embed]})
    }
}