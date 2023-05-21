const {MessageEmbed} = require('discord.js')
const items = require('../database/objects.json');
const {i18n} = require('../i18n/i18n')
module.exports = {
	name: 'items',
    category: "Inventory",
	execute(message, args) {
        const guildId = message.guildId
        const objects = i18n.i(items,guildId)
        const Embed = new MessageEmbed()
            .setTitle(i18n.t("commands.inventory.items.title",guildId))
            .setColor('ffd700')
        let FieldsArray = []
        for (let item in objects) {
            FieldsArray.push({
                name: objects[item].name,
                value: `ID${i18n.t("highpunctuation",guildId)}: ${objects[item].id.toString()}`,
                inline: true,
            });
        }
        Embed.fields = FieldsArray
        message.channel.send({embeds : [Embed]})
        message.delete()         
	}, 
};