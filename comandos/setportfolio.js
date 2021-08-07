const Discord = require("discord.js");
const firebase = require('firebase')

module.exports.run = (client, message, args) => {

    const database = firebase.database()

    if(!args[0]) return message.reply({ embed: {
        title: ':exclamation: Insira um link válido.',
        description: 'Você deve inserir o link do seu portfólio. Exemplo:```-setportfolio: https://behance.net/azyn```',
        color: '#36393F'
    }})

    database.ref(`Usuários/${message.author.id}`).set({
        portfolio: args[0]
    })

    message.reply({ embed: {
        title: ':astronaut: Sucesso! Seu portfólio foi definido.',
        description: `Link do portfólio: ${args[0]}`,
        color: '#36393F'
    }})

}

module.exports.config = {
    name: 'setportfolio',
    description: 'Use este comando para setar o portfólio.',
    aliases: ['setportfólio'],
    usage: [],
    permissions: [],
    category: 'user'
}