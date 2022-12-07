const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const Discord = require('discord.js')
module.exports = {
	name: 'beton',
	description: 'To smash the bad guys',
    category: "Interaction",
    use: "`!beton <user>`",
    example: "`!beton @R2-D2`",
	execute(message, args) {
        const member = message.member.displayName
        const target = message.mentions.members.first()
        if(target !==undefined){
            if(target.user.avatar !== null){
                const avatar = 'https://cdn.discordapp.com/avatars/'+target.id+'/'+target.user.avatar+'.png'
                const width = 339
                const height = 480

                const canvas = createCanvas(width, height)
                const context = canvas.getContext('2d')

                loadImage(avatar).then(image2 => {
                    context.drawImage(image2,45,180,250,250)
                    loadImage('https://media.discordapp.net/attachments/753330903203184660/903414040288702474/betonparticles.png').then(image => {
                        context.drawImage(image, 0, 0, 339, 480)
                        const buffer = canvas.toBuffer('image/png')
                        fs.writeFileSync('./beton.png', buffer)
                        const attachment = new Discord.MessageAttachment('./beton.png', 'beton.png');
                        const embed = new Discord.MessageEmbed()
                            .setDescription("**"+member+"** envoie un bloc de béton sur **"+target.displayName+"**")
                            .setImage('attachment://beton.png')
                            .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })});
                        message.channel.send({embeds: [embed], files: [attachment]});
                    })
                })
            }else{
                const attachment = new Discord.MessageAttachment('./default.png', 'default.png');
                const embed = new Discord.MessageEmbed()
                    .setDescription("**"+member+"** envoie un bloc de béton sur **"+target.displayName+"**")
                    .setImage('attachment://default.png')
                    .setFooter({text: `Requested by ${message.member.displayName} (${message.author.tag})`, iconURL: message.author.displayAvatarURL({ format: 'png' })});
                message.channel.send({embeds: [embed], files: [attachment]});
            }
        }else{
            const ErrorBetonEmbed = new Discord.MessageEmbed()
                        .setColor("#ef5350")
                        .setTitle("Commande Beton")
                        .setDescription("Vous devez mentionnez un utilisateur pour utiliser cette interaction.\n\n**Usage**\n`!beton <target>`\n\n**Example Usage**\n`!beton @R2-D2`\n")
                        .setFooter({text: "Catégorie de commande: Interaction"});
            message.channel.send({embeds: [ErrorBetonEmbed]})
        }
        message.delete()
	}, 

};