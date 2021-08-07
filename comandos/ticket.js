const Discord = require("discord.js");

module.exports.run = (client, message, args) => {

    message.delete();
    message.channel.send(new Discord.MessageEmbed()
    .setTitle("Every Studios - Criar Ticket")
    .setDescription("Obrigado por escolher a Every!\nVocê está a alguns passos de realizar seu pedido com uma equipe profissional de freelancers.\n\nClique em 📝 para criar um ticket.")
    .setColor("#36393F")
    ).then(msg => { msg.react('📝'); });

}

module.exports.config = {
    name: 'open',
    description: 'Use este comando para criar um ticket.',
    aliases: [],
    usage: [],
    permissions: ["ADMINISTRATOR"],
    category: 'admin'
}