const {MessageEmbed} = require('discord.js')
const objects = require('../database/objects.json');
module.exports = {
	name: 'items',
	description: 'List all the existing items.',
	execute(message, args) {
        const Embed = new MessageEmbed()
            .setTitle('Liste des objets')
            .setColor('ffd700')
        let FieldsArray = []
        for (item in objects) {
            FieldsArray.push({
                name: objects[item].name,
                value: `**Id** : ${objects[item].id.toString()}`,
                inline: true,
            });
        }
        Embed.fields = FieldsArray
        message.channel.send({embeds : [Embed]})
        message.delete()         
	}, 
};