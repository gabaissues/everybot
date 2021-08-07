const Discord = require("discord.js");
const firebase = require('firebase')
const fs = require("fs");
const c = require("colors");

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }

firebase.initializeApp(firebaseConfig);

const client = new Discord.Client({
    ws: { Intents: new Discord.Intents(Discord.Intents.ALL) },
    partials: ["MESSAGE", "REACTION"]
});

const config = require("./configuração/config.json");

client.commands = new Discord.Collection();

client.config = config;
client.c = c;

fs.readdir('./eventos', (err, files) => {
    if (err) throw err;

    files.forEach(file => {
       const evento = require("./eventos/" + file);
       const nome = file.split(".")[0];
       client.on(nome, evento.bind(null, client)) 
    });
});

fs.readdir('./comandos/', (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const comando = require('./comandos/' + file);
        if (!comando.config) return console.warn(`${c.yellow('[AVISO]')} Encontrei um comando sem configuração: ${file}`);
        if (!comando.config.name) return console.warn(`${c.yellow('[AVISO]')} Encontrei um comando sem configuração: ${file}`);

        client.commands.set(comando.config.name, comando);

        if (!comando.config.aliases) return;
        comando.config.aliases.forEach(alias => client.commands.set(alias, comando));
    });
});

client.login(client.config.TOKEN)
.then(() => {
    console.log(c.green("[SUCESSO] ") + c.white("BOT ligado com sucesso!"));
})
.catch(err => {
    console.error(c.red("[ERRO] ") + c.white("Ocorreu um erro ao ligar o BOT:\n", err));
});