const mongoose = require('../database/mongoose')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: 'patchnote',
    description: 'Learn about the last updates of the bot.',
    category: 'Other',
    use:"`!patchnote` - Affiche le dernier patchnote en date",
    example:"`!patchnote`",
    execute(message, args) {
        const Embed = new MessageEmbed()
            .setTitle("Patch Note")
            .setDescription(
                "- Implementation of **multilanguages support** (currently english and french).\n- Fight system fixed\n- `Automod` implementation (wip)\n- New command: `poll` (wip)\n- Small implementations: `avatar`, `ping`..."
                )
            .setColor('GREEN')
            .setFooter({text:"version: 3.0.1"})
        message.channel.send({embeds:[Embed]})
    }
}