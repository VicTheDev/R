const Discord = require('discord.js')
const fs = require('fs');
const path = require('path');
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.js'));
module.exports = {
    name: 'info',
    description: 'Some bullshit about this bot(just kidding)',
    category: "Other",
    execute(message,args){
        const InfoEmbed = new Discord.MessageEmbed()
            .setTitle(':information_source: About R2-D2')
            .setDescription('<@830801834251386881> is an open-source bot that complements <@275270122082533378> by using the same command structure and user interface. \nSince the closure of <@275270122082533378> (mid-2022), <@830801834251386881> is also a self-hosted version. \nIt is being regularly updated with new features, commands and games!\n\n**Profile picture**\nhttps://iconarchive.com/show/starwars-longshadow-flat-icons-by-creativeflip/R2D2-icon.html')
            .setThumbnail('https://icons.iconarchive.com/icons/creativeflip/starwars-longshadow-flat/256/R2D2-icon.png')
            .setColor("#4172bf")
            .setFields([
                {name:'Original commands:', value: `${commandFiles.length}`, inline: true},
                {name: 'Lines of Code:', value:'2141', inline: true}
            ]);
        message.channel.send({embeds: [InfoEmbed]})
        message.delete()
    },
}