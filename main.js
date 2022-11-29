// Dependencies
const fs = require('fs');
const path = require('path');
const {Client,Intents,Collection} = require('discord.js');
const mongooseConnection = require('./database/mongooseLOG')
const { PREFIX, PRIVATETOKEN, TOKEN, ALTERPREFIX } = require('./config.json');
const {Inventory} = require('./database/mongoose');
const Help = require ('./help');


// Set up client
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'] });
client.commands = new Collection();


// Set up commands handler
const commandFiles = fs.readdirSync(path.resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	console.log(`|| Command ${command.name} successfuly loaded`)
}


// Connect to Database
mongooseConnection.init()


// Set Bot Status
client.on('ready',() => {
    client.user.setStatus('available')
    client.user.setPresence({
        status: 'online',
        activities: [{ 
            name: "l'empire brûler",
            type: 'WATCHING',
            url: 'https://www.academiedelu.fr'
        }]
    })
    console.log(`Ready | Logged in as "${client.user.tag}"`)
})


// Handling messages
client.on('messageCreate', message => {	
	/*if(message.content.startsWith("r2"+PREFIX+"help")){
        Help.help(message,PREFIX)
    }*/
	if (!(message.content.startsWith(PREFIX) || message.content.startsWith(ALTERPREFIX)) || message.author.bot) return;
	let prefixLength = PREFIX.length
	if(message.content.startsWith(ALTERPREFIX)){prefixLength = ALTERPREFIX.length}
	const args = message.content.slice(prefixLength).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


// Login
client.login(PRIVATETOKEN);