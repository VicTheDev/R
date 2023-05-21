const { MessageEmbed, Collection, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const {i18n} = require('../i18n/i18n');
const {PREFIX} = require('../config.json');
const surveys = new Collection();
module.exports = {
    name: "poll",
    category: "Utility",
    execute(message,args){
        const guildId = message.guildId
        if(args[0]=="create"){
            const Embed = new MessageEmbed()
                .setTitle(i18n.t("commands.utility.poll.create.title",guildId))
                .setDescription(i18n.t("commands.utility.poll.create.description",guildId))
                .setColor(11945994) 
            const preview = new MessageEmbed()
                .setAuthor({name:i18n.t("commands.utility.poll.create.preview",guildId)})
                .setColor(11945994);
                
            const selectMenu = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('editpoll')
                        .setPlaceholder(i18n.t("commands.utility.poll.create.row.selectmenu.placeholder",guildId))
                        .addOptions([
                            {
                                label: i18n.t("commands.utility.poll.create.row.selectmenu.title.label",guildId),
                                description: i18n.t("commands.utility.poll.create.row.selectmenu.title.description",guildId),
                                value: 'polltitle',
                            },
                            {
                                label: i18n.t("commands.utility.poll.create.row.selectmenu.description.label",guildId),
                                description: i18n.t("commands.utility.poll.create.row.selectmenu.description.description",guildId),
                                value: 'polldescription',
                            },
                            {
                                label: i18n.t("commands.utility.poll.create.row.selectmenu.options.label",guildId),
                                description: i18n.t("commands.utility.poll.create.row.selectmenu.options.description",guildId),
                                value: 'polloptions',
                            },
                            {
                                label: i18n.t("commands.utility.poll.create.row.selectmenu.duration.label",guildId),
                                description: i18n.t("commands.utility.poll.create.row.selectmenu.duration.description",guildId),
                                value: 'pollduration',
                            },

                        ])
                );
            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('startpoll')
                        .setLabel(i18n.t("commands.utility.poll.create.row.buttons.start",guildId))
                        .setStyle('SUCCESS')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('abortpoll')
                        .setLabel(i18n.t("commands.utility.poll.create.row.buttons.abort",guildId))
                        .setStyle('DANGER')

                );
            message.channel.send({embeds:[Embed,preview],components:[selectMenu,buttons]})
                .then(m => editPoll(message,m))
                .catch(err=>console.error(err))

        }else{
            const Embed = new MessageEmbed()
                .setTitle(i18n.t("commands.utility.poll.default.title",guildId))
                .setColor(11945994)
                .setDescription(i18n.t("commands.utility.poll.description",guildId))
                .addFields(
                    i18n.t("commands.utility.poll.default.fields.howto",guildId),
                    {name:'\u200b', value: '\u200b', inline:true},
                    i18n.t("commands.utility.poll.default.fields.current",guildId)
                );
            Embed.fields[0].value = Embed.fields[0].value.replace('{prefix}',PREFIX)
            Embed.fields[2].value = surveys.get(guildId) == undefined ? Embed.fields[2].value : surveys.get(guildId).length == 0 ? Embed.fields[2].value : '```\n- '+surveys.get(guildId).join('\n- ')+'\n```' 
            message.channel.send({embeds:[Embed]})

        }
        function editPoll(message,botmessage) {
            const poll = {}
            const filterComponent = i => i.user.id == message.author.id && i.message.id == botmessage.id;
            const filterMessage = m => m.author.id == message.author.id;
            const filterNumber = m => m.author.id == message.author.id && Number.isInteger(parseInt(m.content))
            const componentCollector = botmessage.createMessageComponentCollector({ filterComponent, time: 120_000 });
            let query;
            const EmbedEdit = new MessageEmbed()
                .setColor('YELLOW')
            const embeds = botmessage.embeds
            embeds.push(EmbedEdit)
            componentCollector.on('collect', i => {
                switch(i.customId){
                    case 'editpoll':
                        switch(i.values[0]){
                            case 'polltitle':
                                i.deferUpdate()
                                embeds[2].description = (i18n.t("commands.utility.poll.edit.title",guildId));
                                botmessage.edit({embeds:embeds}).then(m=>botmessage = m)
                                const titleCollector = botmessage.channel.createMessageCollector({ filterMessage,maxProcessed:1,time:30_000});
                                titleCollector.on('collect', m =>{
                                    embeds[1].title = m.content
                                    poll.title = m.content
                                    m.delete()
                                    botmessage.edit({embeds:embeds}).then(m=>botmessage = m)
                                    titleCollector.stop()
                                })
                                break;
                            case 'polldescription':
                                i.deferUpdate()
                                embeds[2].description = (i18n.t("commands.utility.poll.edit.description",guildId))
                                botmessage.edit({embeds:embeds}).then(m=>botmessage = m)
                                const descriptionCollector = botmessage.channel.createMessageCollector({ filterMessage,maxProcessed:1,time:30_000});
                                descriptionCollector.on('collect', m =>{
                                    embeds[1].description = m.content
                                    poll.description = m.content
                                    m.delete()
                                    botmessage.edit({embeds:embeds})
                                    descriptionCollector.stop()
                                })
                                break;
                            case 'polloptions':
                                i.deferUpdate()
                                embeds[2].description = (i18n.t("commands.utility.poll.edit.options.number",guildId))
                                botmessage.edit({embeds:embeds}).then(m=>botmessage = m)
                                const optionsNumberCollector = botmessage.channel.createMessageCollector({ filterNumber, maxProcessed:1,time:30_000});
                                optionsNumberCollector.on('collect', m =>{
                                    embeds[0].fields.push({name:i18n.t("commands.utility.poll.edit.options.choices",guildId), value:"\u200b",inline:true})
                                    
                                    poll.choices = []
                                    m.delete()
                                    botmessage.edit({embeds:embeds})
                                    optionsNumberCollector.stop()
                                })

                                break;
                            case 'pollduration':
                                i.deferUpdate()
                                embeds[2].description = (i18n.t("commands.utility.poll.edit.duration",guildId))
                                botmessage.edit({embeds:embeds}).then(m=>botmessage = m)
                                const durationCollector = botmessage.channel.createMessageCollector({ filterNumber, maxProcessed:1,time:30_000});
                                durationCollector.on('collect', m =>{
                                    embeds[1].footer = {text    :m.content+' s'}
                                    poll.duration = (parseInt(m.content))
                                    m.delete()
                                    botmessage.edit({embeds:embeds}).then(m => console.log(m))
                                    durationCollector.stop()
                                })
                                break;
                        }
                        break;
                    case 'start':
                        break;
                    case 'abort':
                        break;
                }
            })

        }
    }
}