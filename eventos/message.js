const Discord = require("discord.js");
const fs = require("fs");

module.exports = (client, message) => {
    if (message.author.bot || message.channel.type == "dm") return;

    let config = client.config;
    if (message.content.indexOf(config.PREFIXO) != 0) return;
    
    const args = message.content.slice(config.PREFIXO.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    let comando = client.commands.get(command);
    if (!comando) return;

    if (!message.member.hasPermission(comando.config.permissions)) return message.channel.send(new Discord.MessageEmbed()
    .setDescription("Você não tem permissões suficientes para executar o comando!")
    .setColor("#FD4962")
    );

    comando.run(client, message, args);
}