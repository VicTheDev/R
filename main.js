const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const mongooseConnection = require('./database/mongooseLOG')
const { PREFIX, PRIVATETOKEN, MAINTOKEN } = require('./config.json');

const client = new Discord.Client({partials: ['MESSAGE', 'REACTION', 'CHANNEL']});
client.commands = new Discord.Collection();

const Help = require ('./help');

const commandFiles = fs.readdirSync(path.resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	console.log(`|| Command ${command.name} successfuly loaded ✅`)
}

mongooseConnection.init()

client.on('ready',() => {
    client.user.setStatus('available')
    client.user.setPresence({
        status: 'online',
        activity: { 
            name: "l'empire brûler",
            type: 'WATCHING',
            url: 'https://www.academiedelu.fr'
        }
    })
    console.log(`Ready | Logged in as "${client.user.tag}"`)
})

client.on('message', message => {
	if(message.content.startsWith("r2"+PREFIX+"help")){
        Help.help(message,PREFIX)
    }
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(MAINTOKEN);