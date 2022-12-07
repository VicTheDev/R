const {MessageEmbed} = require('discord.js')
const objects = require('../database/objects.json')
module.exports = {
	name: 'item',
	description: 'Get informations about an item.',
    category: "Inventory",
    use: '`!item <id>`\n`!item <itemName>`',
    example: "`!item 3`\n`!item pelle`",
	execute(message, args) {
        let item = objects.find(o => o.name.toLowerCase()==args.join(' ').toLowerCase())
        if(item==undefined){item = objects.find(o=>o.id==args[0])}
        if(item!==undefined){
            const Embed = new MessageEmbed()
                .setTitle(item.name)
                .setDescription(item.description)
                .setColor('ffd700')
                .addFields(
                    { name: 'Available for sale?', value: item.saleable ? 'Yes' : 'No', inline: true},
                    { name: 'Card?', value: item.card ? 'Yes' : 'No', inline:true},
                    { name: 'Id', value: item.id.toString(), inline: true}
                );
            message.channel.send({embeds : [Embed]})
            message.delete()         
        }else{
            message.reply({content: "L'item spécifié n'existe pas ou n'a pas été trouvé. Merci de vérifier que vous l'avez correctement écrit."})
        }
	}, 
};