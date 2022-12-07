const mongoose = require('../database/mongoose')
const {MessageEmbed} = require('discord.js')
const {SuperAdmin} = require('../config.json')
module.exports = {
    name: 'patch',
    description: 'Upload Patch Note (Admin only).',
    category: 'Admin',
    use:"`!patch <content>` - Upload un nouveau patchnote avec le contenu <content>",
    example:"`!patch Nouveau : commande !patchnote ajoutée`",
    async execute(message, args) {
        const ts = new Date()
        ts.setMilliseconds(Date.now())
        if(message.author.id!=SuperAdmin){return};
        /*let patchcontent = new String
        for(i of args){
            if(i == "\n"){
                patchcontent += '\n'
            }else{
                patchcontent += i + ' '
            }
        }
        const element = await mongoose.Patch.create({
            date: ts, 
            content: patchcontent
        });
        await element.save();
        console.log('Patch Note Uploaded')
        const Embed = new MessageEmbed()
            .setTitle(`Patch Note : ${element.date.toString()}`)
            .setDescription(element.content);
        message.reply({embeds : [Embed]})*/
    }
}