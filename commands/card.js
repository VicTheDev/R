const {MessageEmbed} = require('discord.js');
const cards = require('../database/cards.json')
module.exports = {
    name:"card",
    description:"Display Card",
    category:"Inventory",
    use:"`!card <id>`\n`!card <cardname>`",
    example:"`!card 5`\n`!card gardien des bois`",
    execute(message, args){
        let card = cards.find(x => x.name.toLowerCase()==args.join(' ').toLowerCase())
        if(card == undefined){
            card = cards.find(x => x.id==args[0])
            if(card == undefined){
                message.reply("La carte spécifiée n'a pas été trouvée")
            }else{
                displayCard(message, card)
            }
        }else{
            displayCard(message, card)
        }
    }
}

function displayCard(message, card){
    const cardBody = new MessageEmbed()
        .setImage(card.image)
        .setColor('821EDA');
    const cardFooter = new MessageEmbed()
        .setTitle(card.name)
        .setDescription(`${card.description}\n${card.use}`)
        .addFields(
           {name: 'Mana :', value: String(card.mana), inline:true},
           {name: 'Id : ', value: String(card.id), inline:true}
        )
        .setColor('000000');
    message.channel.send({embeds: [cardBody,cardFooter]})
}