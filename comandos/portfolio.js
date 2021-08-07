const Discord = require("discord.js");
const firebase = require('firebase')

module.exports.run = async (client, message, args) => {

    const database = firebase.database()
    const membro = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]))

    if(!membro) {

        let snap = await database.ref(`Usuários/${message.author.id}`).once('value')

        message.channel.send({
            embed: {
                title: `:astronaut: Portfólio de: ${message.author.tag}`,
                description: snap.val().portfolio,
                color: '#36393F'
            }
        })

    } else {

        let snap = await database.ref(`Usuários/${membro.id}`).once('value')

        message.channel.send({
            embed: {
                title: `:astronaut: Portfólio de: ${membro.user.tag}`,
                description: snap.val() ? snap.val().portfolio : 'Não definido',
                color: '#36393F'
            }
        })

    }

}

module.exports.config = {
    name: 'portfolio',
    description: 'Use este comando para visualizar um portfólio.',
    aliases: ['portfólio', 'portfolio'],
    usage: [],
    permissions: [],
    category: 'user'
}