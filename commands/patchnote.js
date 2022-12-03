const mongoose = require('../database/mongoose')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: 'patchnote',
    description: 'Learn about the last updates of the bot.',
    category: 'Other',
    execute(message, args) {
        /*if(Number.isInteger(parseInt(args[0]))){
            let patch = mongoose.Patch.findById(parseInt(args[0]))
            const Embed = new MessageEmbed()
            .setTitle(`Patch Note : ${patch.date.toString()}`)
            .setDescription(patch.content)
            .setFooter({name: `id: ${patch._id}`});
        }else{
            let patch = mongoose.Patch.find().sort({_id:-1}).limit(1)
            const Embed = new MessageEmbed()
            .setTitle(`Patch Note : ${patch.date.toString()}`)
            .setDescription(patch.content)
            .setFooter({name: `id: ${patch._id}`});
        }*/
        const Embed = new MessageEmbed()
            .setTitle('Patchnote de Noël')
            .setDescription(`Les fêtes de fin d'année approchent et pour l'occasion R2 s'est doté de nouvelles fonctionnalités, et a corrigé de nombreux bugs et défauts.`)
            .addFields(
                {name: 'Combats', value: "Après plus d'un an, les duels sont enfin disponibles dans leur forme aboutie ! Doté d'un système de cartes collectionables, il sera amélioré par le futur et de nouveaux sets de cartes feront leur apparition pour rajouter de la complexité au gameplay. \n`!fight @R2D2`", inline: false},
                {name: 'Commandes estivales', value:'Grand retour des commandes de noël ! `!snowman` \n`!snowball` ...',inline: true},
                {name: 'Help menus', value: 'Les menus "Help" ont été mis à jour et améliorés. \n`r2!help`',inline:true},
                {name: 'Bugs', value: "Correction de divers bugs liés par exemple aux cooldowns et aux limites de temps pour certaines commandes, ainsi qu'au passage à discordjs@13.3.1"}
            )
            .setColor('fffffe');
        message.channel.send({embeds: [Embed]})
    }
}