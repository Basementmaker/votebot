const Discord = require("discord.js");
// use discord.js
var bot = new Discord.Client();
// sets Discord.Client to bot
const BOT_TOKEN = "MzgxMjYwNDA2MTUwMjY2ODkw.DSLumQ.IIQlkTqA_Es103vaENUo8RUQwFI";
// bot's token
const PREFIX = "~";
// bot's prefix
var vote = "nothing"

bot.on("ready", function() {
    // when the bot starts up, set its game to Use 
    // *help and tell the console "Booted up!"
    bot.user.setGame("Use ~info")
    // sets the game the bot is playing
    console.log("Bot is now online")
    // messages the console Bot is now online!
    console.log("Use CTRL+C to shut down bot")
    // messages the console 
});

bot.on("message", (message)=>{
    // when a message is sent
    if (message.author.equals(bot.user))
        return;

    if (!message.content.startsWith(PREFIX))
        return;

    var args = message.content.substring(PREFIX.length).split(" ");
    var command = args[0].toLowerCase();

    if (command === "vote") {

        if (!message.member.roles.some(r=>["Votebot.Start", "Votebot.*"].includes(r.name))) {
            message.reply("Sorry, you do not have the permission to do this!");
            return
        }

        message.channel.send("Type what you would like the vote to be about starting with a *. You have 60 seconds.").then(()=>{
            const filter = m=>m.content.startsWith('*');
            var vote = message.channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time']
            }).then(()=>{
                message.channel.send("Great! Starting a vote now");
                message.channel.send(vote.content)
                message.react('✅');
                message.react('❎');
            }
            );
        }
        );
    }
    function kickcheck(message, type, member) {
        var types = type || "KICK_MEMBERS";
        var userish = member || message.author.id;
        let membering = message.guild.member(userish);
        var permas = message.channel.permissionsFor(membering);
        var permis = permas.serialize()["KICK_MEMBERS"];
        if (permis !== true) {
            return false
        } else {
            return true
        }
    }
    // Authorization
    if (kickcheck(message) == true && message.content.toUpperCase().startsWith(PREFIX + "ADMINPOLL")) {
        // Bot message => Edit
        message.channel.send({
            embed: {
                title: "Please enter a [title|description] for your Poll. Example: Giveaway Command|Please vote down below"
            }
        }).then(function(a) {
            // Await
            message.channel.awaitMessages(b=>b.author.id == message.author.id, {
                max: 1,
                time: 20000,
                errors: ['time']
            }).then(function(c) {
                // Converting Text
                if (c.array()[0].content.match("\|") == null) {
                    var d = {
                        title: c.array()[0].content
                    };
                } else {
                    var d = {
                        title: c.array()[0].content.split("\|")[0],
                        description: c.array()[0].content.split("\|")[1]
                    };
                }
                // Deleting message {a}
                a.delete();
                // Array Variable ( Contains 2D Array )
                var z = '';
                var e = [];
                var f = 0;
                var g = '';
                // Mapping channel ids to {e}
                message.guild.channels.map((h)=>{
                    z += "[" + f + "] " + h.id + " " + h.name + "\n";
                    e.push({
                        number: f,
                        id: h.id,
                        name: h.name
                    })
                    f += 1;
                }
                );
                // Sending Channel List
                message.channel.send({
                    embed: {
                        "title": "Please select a channel through a number ranging from 0-" + e.length,
                        description: "```\n" + z + "```"
                    }
                }).then(function(j) {
                    // Await
                    message.channel.awaitMessages(k=>k.author.id == message.author.id && k.content.match(/(\d+)/gmi) !== null, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    }).then(l=>{
                        // Retrieve content ( GIMME MY CONTENT )
                        var m = l.array()[0].content.match(/\d+/gmi)[0];
                        // Mapping Channel to retrieve.
                        if (Number(m) > e.length)
                            return message.reply("Please enter a number within the range.");
                        var n = e[Number(m)];
                        // Delete (j)
                        j.delete();
                        // Message confirmed
                        message.channel.send({
                            embed: {
                                "title": "How long would you like to wait? ( in minutes )"
                            }
                        }).then(function(o) {
                            // Delete

                            // Await
                            message.channel.awaitMessages(p=>p.author.id == message.author.id && p.content.match(/(\d+)/gmi) !== null, {
                                max: 1,
                                time: 10000,
                                errors: ['time']
                            }).then(q=>{
                                console.log(n);
                                o.delete();
                                // Minutes
                                var r = 1000 * 60 * parseInt(q.array()[0].content.match(/[\d+]/gmi)[0]);
                                message.guild.channels.get(n.id).send({
                                    embed: d
                                }).then(function(s) {
                                    s.react('✅');
                                    s.react('❌');
                                    o.delete();
                                    var synccollector = s.createReactionCollector((reaction)=>reaction.emoji.name == '✅' || reaction.emoji.name == '❌', {
                                        time: r
                                    });
                                    synccollector.on('end', function(synccollected) {
                                        var v = synccollected.get('❌') || {
                                            _emoji: {
                                                reaction: {
                                                    count: 0
                                                }
                                            }
                                        };
                                        var w = synccollected.get('✅') || {
                                            _emoji: {
                                                reaction: {
                                                    count: 0
                                                }
                                            }
                                        };
                                        message.guild.channels.get(n.id).send("**Voted**: " + (w._emoji.reaction.count - 1) + "\n**Denied**: " + (v._emoji.reaction.count - 1))
                                    })
                                })
                            }
                            )
                        })
                    }
                    )
                });
            })
        })
    }
    if (message.content.toLowerCase().startsWith(PREFIX + "votestart")) {
        if (kickcheck(message, "MANAGE_ROLES", bot.user.id) == false)
            return message.reply("VoteBot lacks manage roles permission.");
        if (message.guild.roles.find('name', "Votebot.Start") == null) {
            guild.createRole({
                name: 'Votebot.Start',
                color: 'BLUE',
            }).then(function() {
                message.channel.send("`Votebot.*` role was made.").then(v=>{
                    setTimeout(function() {
                        v.delete()
                    }, 6000)
                }
                )
            })
        }
        if (message.guild.roles.find('name', "Votebot.*") == null) {
            guild.createRole({
                name: 'Votebot.*',
                color: 'BLUE',
            }).then(function() {
                message.channel.send("`Votebot.*` role was made.").then(v=>{
                    setTimeout(function() {
                        v.delete()
                    }, 6000)
                }
                )
            })
        }
        if (message.guild.roles.find('name', "Votebot.*") || message.guild.roles.find('name', "Votebot.Start")) {
            message.channel.send({
                embed: {
                    title: "Please enter a [title|description] for your Poll ( 2 minutes ). Example: Vote for the new President of United States of America|[Yes] or [No]"
                }
            }).then(function(a) {
                // Await
                message.channel.awaitMessages(b=>b.author.id == message.author.id, {
                    max: 1,
                    time: 120000,
                    errors: ['time']
                }).then(function(c) {
                    var message_core = c.array()[0];
                    a.delete();
                    if (c.array()[0].content.match("\|") == null) {
                        var d = {
                            title: c.array()[0].content
                        };
                    } else {
                        var d = {
                            title: c.array()[0].content.split("\|")[0],
                            description: c.array()[0].content.split("\|")[1]
                        };
                    }
                    d["author"] = {
                        "name": message.author.tag + "'s poll"
                    }
                    message.channel.send({
                        embed: {
                            "title": "How long would you like to wait? ( in minutes )"
                        }
                    }).then(function(o) {
                        // Delete

                        // Await
                        message.channel.awaitMessages(p=>p.author.id == message.author.id && p.content.match(/(\d+)/gmi) !== null, {
                            max: 1,
                            time: 10000,
                            errors: ['time']
                        }).then(q=>{
                            console.log(n);
                            o.delete();
                            // Minutes
                            var r = 1000 * 60 * parseInt(q.array()[0].content.match(/[\d+]/gmi)[0]);
                            message.guild.channels.get(n.id).send({
                                embed: d
                            }).then(function(s) {
                                s.react('✅');
                                s.react('❌');
                                o.delete();
                                var synccollector = s.createReactionCollector((reaction)=>reaction.emoji.name == '✅' || reaction.emoji.name == '❌', {
                                    time: r
                                });
                                synccollector.on('end', function(synccollected) {
                                    var v = synccollected.get('❌') || {
                                        _emoji: {
                                            reaction: {
                                                count: 0
                                            }
                                        }
                                    };
                                    var w = synccollected.get('✅') || {
                                        _emoji: {
                                            reaction: {
                                                count: 0
                                            }
                                        }
                                    };
                                    message.guild.channels.get(n.id).send("**Voted**: " + (w._emoji.reaction.count - 1) + "\n**Denied**: " + (v._emoji.reaction.count - 1))
                                })
                            })
                        }
                        )
                    })
                })
            })
        }
        ;
    }

}
);

bot.login(BOT_TOKEN);