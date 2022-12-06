const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "source",
    description: "Get source code of R2D2",
    category: "Other",
    execute(message, args){
        const Embed = new MessageEmbed()
            .setDescription('code source R2D2 \n\nhttps://github.com/VicTheDev/R2D2')
            .setColor('DARK_BLUE');
        message.channel.send({embeds:[Embed]})
    }
}