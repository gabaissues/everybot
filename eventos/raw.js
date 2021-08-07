const Discord = require("discord.js");
const firebase = require('firebase')

const database = firebase.database()

module.exports = async (client, dados) => {
    if (dados.t != "MESSAGE_REACTION_ADD") return;

    let servidor = client.guilds.cache.get(dados.d.guild_id);
    if (!servidor) return;

    let canal = servidor.channels.cache.get(dados.d.channel_id);
    let membro = servidor.members.cache.get(dados.d.user_id);

    let mensagem = canal.messages.fetch(dados.d.message_id)
    .then(async message => {
        let reaction = dados.d.emoji.name;

        function removeReaction() {
            try { message.reactions.cache.get(dados.d.emoji.name).users.remove(membro) } catch(err) { return; };
        }

        if (!message.embeds[0]) return;
        if (message.embeds[0].type != 'rich') return;
        if (membro.user.bot) return;

        if (message.embeds[0].title == "Every Studios - Criar Ticket") {
            removeReaction();
            if (reaction != '📝') return;

            let channel = servidor.channels.cache.find(channel => channel.type == "text" && channel.topic == `ID do Usuário: ${membro.id}`);
            if (channel) return canal.send(new Discord.MessageEmbed()
            .setDescription(`<@${membro.id}> você já possui um atendimento aberto.\n\nClique aqui para ir até ele: <#${channel.id}>`)
            .setColor("#36393F")
            ).then(msg => { setTimeout(function() { try { msg.delete(); } catch(err) { return } }, 5000) });

            let comission = servidor.channels.cache.find(channel => channel.name == `comissão-${membro.id}`);
            if (comission) return canal.send(new Discord.MessageEmbed()
            .setDescription(`<@${membro.id}> você já possui uma ticket aberto.\n\nClique aqui para ir até ele: <#${comission.id}>`)
            .setColor("#36393F")
            ).then(msg => { setTimeout(function() { try { msg.delete(); } catch(err) { return } }, 5000) });

            channel = await servidor.channels.create(`ticket-de-${membro.user.username}`, {
                parent: '860616858129137694',
                topic: `ID do Usuário: ${membro.id}`,
            });

            setTimeout(function() {
                channel.overwritePermissions([
                    { id: membro.id, allow: ["VIEW_CHANNEL"] },
                    { id: servidor.roles.everyone.id, deny: ["VIEW_CHANNEL"] },
                    { id: '860618650683310111', allow: ["VIEW_CHANNEL"] }
                ]);

                canal.send(new Discord.MessageEmbed()
                .setTitle("Every Studios - Ticket Aberto")
                .setDescription(`<@${membro.id}>, seu atendimento acaba de ser criado.\n\nPara acessá-lo, basta clicar aqui: <#${channel.id}>`)
                .setColor("#36393F")
                ).then(msg => { setTimeout(function() { try { msg.delete(); } catch(err) { return } }, 5000) });

                let cargos = [ "860623660721504298", "860623941549948949", "860624042670424064", "860623808444891146", "860638271410536458" ];

                channel.send(new Discord.MessageEmbed()
                .setTitle("1. Mencione o @ do cargo do serviço que você deseja.")
                .setDescription(cargos.map(cargo => `• <@&${cargo}>`).join('\n'))
                .setFooter("Você tem 3 minutos para responder!")
                )
                .then(msg => {
                    msg.react('❌');

                    let perguntas = [];

                    let messageCollector = channel.createMessageCollector((m) => m.author.id == membro.id, { max: 1 });
                    messageCollector.on('collect', m => {
                        if (!m.content) return channel.send(new Discord.MessageEmbed()
                        .setDescription("Você não inseriu nenhuma mensagem, o canal será deletado.")
                        .setColor("#36393F")
                        ).then(() => { setTimeout(function() { try { if (channel.deleted == false) { channel.delete(); } } catch (err) { return; } }, 5000) })
                        .catch(err => { return; });

                        let role = m.mentions.roles.first();
                        if (!role) return channel.send(new Discord.MessageEmbed()
                        .setDescription("Você não mencionou da função que está procurando, assim sendo, o canal será apagado.")
                        .setColor("#36393F")
                        ).then(() => { setTimeout(function() { try { if (channel.deleted == false) { channel.delete(); } } catch (err) { return; } }, 5000) })
                        .catch(err => { return; });

                        if (cargos.indexOf(role.id) == -1) return channel.send(new Discord.MessageEmbed()
                        .setDescription("Você mencionou um cargo que não se encontrava na lista, assim sendo, o canal será apagado.")
                        .setColor("#36393F")
                        ).then(() => { setTimeout(function() { try { if (channel.deleted == false) { channel.delete(); } } catch (err) { return; } }, 5000) })
                        .catch(err => { return; });

                        let x = 0;

                        channel.send(new Discord.MessageEmbed()
                        .setTitle("2. Qual seu pedido? (1024 caracteres max.)")
                        .setColor("#36393F")
                        )
                        .catch(err => { return; });

                        let perguntasCollector = channel.createMessageCollector((m) => m.author.id == membro.id, { max: 6 });
                        perguntasCollector.on('collect', async (res) => {
                            let texto = res.content;
                            if (!res.content) return channel.send(new Discord.MessageEmbed()
                            .setDescription("Você não inseriu nenhuma mensagem, assim sendo, o canal será apagado.")
                            .setColor("#36393F")
                            ).then(() => { setTimeout(function() { try { if (channel.deleted == false) { channel.delete(); } } catch (err) { return; } }, 5000) })
                            .catch(err => { return; });

                            if (res.content.length > 1024) return channel.send(new Discord.MessageEmbed()
                            .setDescription("Você inseriu demasiados caracteres, assim sendo, terá que refazer o ticket.")
                            .setColor("#36393F")
                            ).then(() => { setTimeout(function() { try { if (channel.deleted == false) { channel.delete(); } } catch (err) { return; } }, 5000) })
                            .catch(err => { return; });

                            perguntas.push(texto);

                            let title;
                            x = x + 1;

                            if (x == 1) {
                                title = '3. Por favor, forneça detalhes  do pedido:';
                            } else if (x == 2) {
                                title = '4. Gostaria de mencionar seu orçamento?';
                            } else if (x == 3) {
                                title = '5. Qual o tempo máximo para conclusão do pedido?';
                            } else if (x == 4) {
                                title = '6. Gostaria de adicionar mais informações?';
                            } else {
                                title = '7. Gostaria de enviar alguma referência? (imagem, link, etc).';
                            }  
                            
                            if (x == 6) {

                                channel.bulkDelete(100)
                                await channel.send({ embed: {
                                    title: ':astronaut: Ticket criado com sucesso!',
                                    description: `Seu ticket foi criado e enviado para nossa equipe. Agora basta aguardar alguns instantes até que alguém revise e venha lhe atender.`,
                                    color: '#36393F'
                                }})

                                //Enviando pro usuário que o ticket foi criado

                                let comissionChannel = client.channels.cache.get("860618032475537458");
                                if (!comissionChannel) {
                                    try { if (channel.deleted == false) { channel.delete(); } } catch (err) { return; }
                                } else {
                                    let embed = new Discord.MessageEmbed()
                                    .setTitle("📋 Nova Comissão!")
                                    .setDescription(`<@&${role.id}>`)
                                    .addFields([
                                        { name: 'Ticket de:', value: `<@${membro.id}>`, inline: true },
                                        { name: 'Pedido:', value: perguntas[0], inline: true  },
                                        { name: 'Detalhes do pedido:', value: perguntas[1], inline: true  },
                                        { name: 'Orçamento:', value: perguntas[2], inline: true  },
                                        { name: 'Prazo de entrega:', value: perguntas[3], inline: true  },
                                        { name: 'Informações adicionais:', value: perguntas[4], inline: true  },
                                        { name: 'Referências:', value: perguntas[5], inline: true  }
                                    ])
                                    .setColor("#58D68D")
                                    .setTimestamp();

                                    if (res.attachments.first()) {
                                        let url = res.attachments.first().url;
                                        if (url.endsWith(".png") || url.endsWith(".gif") || url.endsWith(".jpg")) {
                                            embed.setImage(res.attachments.first().url);
                                        } else {
                                            embed.attachFiles(new Discord.MessageAttachment(url));
                                        }
                                    }

                                    comissionChannel.send(embed)
                                    .then(m => m.react('✅'))
                                    .catch(err => { return; });
                                
                                    try { 
                                        if (channel.deleted == false) { 
                                            channel.setParent("860618115120234496");
                                            
                                            setTimeout(function() {
                                                channel.overwritePermissions([
                                                    { id: membro.id, allow: ["VIEW_CHANNEL"] },
                                                    { id: servidor.roles.everyone.id, deny: ["VIEW_CHANNEL"] },
                                                    { id: '860618650683310111', allow: ["VIEW_CHANNEL"] }
                                                ]);
                                            }, 1000)
                                        } 
                                    } catch (err) { return; }
                                }
                            } else {
                                channel.send(new Discord.MessageEmbed()
                                .setTitle(title)
                                .setColor("#36393F")
                                )
                                .catch(err => { return; });
                            }
                        })
                    })

                    setTimeout(function() {
                        try { if (channel.deleted == false) { channel.delete(); } } catch (err) { return; }
                    }, 180000)
                })
                .catch(err => { return; });                    
            }, 1000);
        } else if (message.embeds[0].title == "📋 Nova Comissão!") {
            removeReaction()
            if (reaction != "✅") return;

            if (message.embeds[0].hexColor == "#e74c3c".toLowerCase()) return canal.send(new Discord.MessageEmbed()
            .setDescription("Essa comissão já está sendo realizada ou já foi concluída.")
            .setColor("#36393F")
            )
            .then(msg => { setTimeout(function() { try { msg.delete(); } catch(err) { return } }, 5000) })
            .catch(err => { return; });

            try { let embed = message.embeds[0]; embed.color = "#E74C3C"; embed.setFooter(`Comissão pega por: ${membro.user.tag}`); await message.edit(embed); } catch (err) { return; }

            let userID = `${message.embeds[0].fields[0].value}`
            .replace('<@', '')
            .replace('>', '')
            .replace('!', '');

            let user = servidor.members.cache.get(userID);
            if (!user) return;

            let channel = servidor.channels.cache.find(channel => channel.type == "text" && channel.topic == `ID do Usuário: ${userID}`);
            if (!channel) return canal.send(new Discord.MessageEmbed()
            .setDescription(`Lamentamos, mas não foi possível encontrar o canal da comissão que pretendia pegar.`)
            .setColor("#36393F")
            ).then(msg => { setTimeout(function() { try { msg.delete(); message.delete(); } catch(err) { return } }, 5000) })
            .catch(err => { return; });

            channel.updateOverwrite(membro.id, { VIEW_CHANNEL: true });

            canal.send(new Discord.MessageEmbed()
            .setTitle("Every Studios - Comissão Aberta")
            .setDescription(`<@${membro.id}>, o canal da sua comissão trabalhando para <@${user.id}> foi criado.\n\nPara acessá-lo, basta clicar aqui: <#${channel.id}>`)
            .setColor("#36393F")
            ).then(msg => { setTimeout(function() { try { msg.delete(); } catch(err) { return; } }, 5000) })
            .catch(err => { return; });

            const membroDb = await database.ref(`Usuários/${membro.id}`).once('value')

            channel.send(new Discord.MessageEmbed()
            .setTitle("Every Studios - Comissão")
            .setDescription(`Um freelancer acaba de aceitar o pedido de <@${userID}>.\n Freelancer: <@${membro.id}>\nPortfólio: ${membroDb.val() ? membroDb.val().portfolio : "Não definido."}\n\nQuando o serviço estiver completo chame um Supervisor ou CEO para fechar o canal.`)
            .setColor("#36393F")
            ).then(msg => { try { msg.react('✅'); } catch(err) { return; } })
            .catch(err => { return; });
        } else if (message.embeds[0].title == "Every Studios - Comissão") {
            removeReaction()
            if (reaction != "✅") return console.log("X");

            let ceo = servidor.roles.cache.get("859889148914303016");
            let supervisor = servidor.roles.cache.get("860618650683310111");

            if (membro.roles.cache.has("859889148914303016") || membro.roles.cache.has("860618650683310111")) {
                try { if (canal.deleted == false) { canal.delete(); } } catch (err) { return; }
            }
        }
    })
    .catch(err => { console.error(`[ERRO] Errinho nessa porra:\n`, err) });

}