const { channel } = require("diagnostics_channel")

module.exports = {
    name:'r2say',
    description:'Just to say something',
    execute(message,args){
        if(message.member.user.tag==='DameVictoria#6226'){
            message.delete()
            const channelid = args.shift()
            let channel = message.guild.channels.cache.get(channelid)
            channel.send(args.join(' '))
        }
    }
}