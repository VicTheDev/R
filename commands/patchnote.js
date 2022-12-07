const mongoose = require('../database/mongoose')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: 'patchnote',
    description: 'Learn about the last updates of the bot.',
    category: 'Other',
    use:"`!patchnote` - Affiche le dernier patchnote en date",
    example:"`!patchnote`",
    execute(message, args) {
        /*if(Number.isInteger(parseInt(args[0]))){
            let patch = mongoose.Patch.findById(parseInt(args[0]))
            const Embed = new MessageEmbed()
            .setTitle(`Patch Note : ${patch.date.toString()}`)
            .setDescription(patch.content)
            .setFooter({text: `id: ${patch._id}`});
        }else{
            let patch = mongoose.Patch.find().sort({_id:-1}).limit(1)
            const Embed = new MessageEmbed()
            .setTitle(`Patch Note : ${patch.date.toString()}`)
            .setDescription(patch.content)
            .setFooter({text: `id: ${patch._id}`});
        }*/
        const Embed = new MessageEmbed()
            .setTitle('Patchnote de Noël')
            .setDescription(`Les fêtes de fin d'année approchent et pour l'occasion R2 s'est doté de nouvelles fonctionnalités, et a corrigé de nombreux bugs et défauts.`)
            .addFields(
                {name: 'Combats', value: "Après plus d'un an, les duels sont enfin disponibles dans leur forme aboutie ! Doté d'un système de cartes collectionables, il sera amélioré par le futur et de nouveaux sets de cartes feront leur apparition pour rajouter de la complexité au gameplay. \n`!fight <user>`", inline: false},
                {name: 'Cartes', value: "Le premier set de carte est sorti ! 8 cartes avec chacune leurs capacités uniques ! Vous pouvez en trouver dans des boosters disponibles dans le shop. \n`!booster`", inline:false},
                {name: 'Echanges', value:"Vous pouvez désormais échanger vos objets avec d'autres personnes !\n`!trade <id1> <user> <id2>`", inline:true},
                {name: 'Duel', value: "Soyez le premier à dégainer, mais attention à ne pas tirer trop tôt ! \n`!duel <user>`", inline:true},
                {name: 'Commandes estivales', value:'Grand retour des commandes de noël ! `!snowman` \n`!snowball` ...',inline: true},
                {name: 'Help menus', value: 'Les menus "Help" ont été mis à jour et améliorés. \n`r2!help`',inline:true},
                {name: 'Bugs', value: "Correction de divers bugs liés par exemple aux cooldowns et aux limites de temps pour certaines commandes, ainsi qu'au passage à discordjs@13.3.1", inline:true}
            )
            .setColor('ffffee');
        message.channel.send({embeds: [Embed]})
    }
}