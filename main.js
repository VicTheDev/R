// Dependencies
const fs = require('fs');	//read and write local files
const path = require('path');	//resolve path issues(here, mainly)
const { Client, Intents, Collection, Permissions } = require('discord.js');	//discordjs Objects to setup the client
const mongooseConnection = require('./database/mongooseLOG')	//connect to database
const { PREFIX, PRIVATETOKEN, TOKEN, ALTERPREFIX } = require('./config.json');
const { i18n } = require('./i18n/i18n')	//internalization module (local)
let guilds = require('./guilds.json')
const {missingPermission} = require('./errorembed')


// Setup client
const client = new Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'],
	intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS', 'GUILDS']
});
client.commands = new Collection();

// Setup commands handler 
const commandFiles = fs.readdirSync(path.resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
console.log(`${commandFiles.length} commands loaded`)

// Connect to Database
mongooseConnection.init()


// Set Bot Status
client.on('ready', () => {
	client.user.setStatus('available')
	client.user.setPresence({
		status: 'online',
		activities: [{
			name: "l'empire brûler : !patchnote",
			type: 'WATCHING'
		}]
	})
	console.log(`Ready | Logged in as "${client.user.tag}"`)
})


// Handling messages
client.on('messageCreate', message => {
	if (guilds[message.guildId]?.mod?.messages && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
		const matches = guilds[message.guildId].mod?.banwords.filter(x => message.content.includes(x))
		if (matches.length > 0) {
			message.delete();
			return;
		}
	}
	if (!(message.content.startsWith(PREFIX) || message.content.startsWith(ALTERPREFIX)) || message.author.bot) return;
	const prefixLength = message.content.startsWith(ALTERPREFIX) ? ALTERPREFIX.length : PREFIX.length
	//if(message.content.startsWith(ALTERPREFIX)){prefixLength = ALTERPREFIX.length}
	const args = message.content.slice(prefixLength).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;
	const perm = client.commands.get(command).permissions ? (message.member.permissions.has(Permissions.FLAGS[client.commands.get(command).permissions]) ? true : false) : true
	if(perm){
		try {
			client.commands.get(command).execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}else{
		message.channel.send({embeds:[missingPermission(client.commands.get(command).permissions,message.guildId)]})
	}
});

//Username moderation
client.on('guildMemberUpdate', (oldMember, newMember) => {
	if (guilds[newMember.guild.id]?.mod?.usernames) {
		const matches = guilds[newMember.guild.id].mod?.banwords.find(x => newMember.displayName.includes(x))
		if (matches?.length > 0) {
			newMember.setNickname(oldMember.displayName, 'Unauthaurized nickname:'+newMember.displayName)
			newMember.user.send(`Your username on **${newMember.guild.name}** was not authorized and has been modified.`)
				.catch(() => {});
			
		}
	}
})

//Check if guilds.json exists
let initGuild = {}
initGuild = JSON.stringify(initGuild)
fs.stat('guilds.json', function (err, stat) {
	if (err == null) {
	} else if (err.code === 'ENOENT') {
		// file does not exist
		console.error('guilds.json file not found, regenerating it...')
		fs.writeFile('guilds.json', initGuild, (err) => {
			if (err) throw err;
		});
	} else {
		console.log('Some other error: ', err.code);
	}
});

// Initiate internationalization module (local)
i18n.init()

// Login to discord client
client.login(PRIVATETOKEN);