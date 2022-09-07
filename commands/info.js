const Discord = require('discord.js')
module.exports = {
    name: 'info',
    description: 'Some bullshit about this bot(just kidding)',
    execute(message,args){
        const InfoEmbed = new Discord.MessageEmbed()
            .setTitle(':information_source: A propos de R2-D2')
            .setDescription('<@830801834251386881> est un bot censé compléter <@275270122082533378> en reprenant les mêmes structures de commandes.\n\n**Image de profil**\nhttps://iconarchive.com/show/starwars-longshadow-flat-icons-by-creativeflip/R2D2-icon.html')
            .setThumbnail('https://icons.iconarchive.com/icons/creativeflip/starwars-longshadow-flat/256/R2D2-icon.png')
            .setColor("#4172bf");
        message.channel.send(InfoEmbed)
        message.delete()
    },
}