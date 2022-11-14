const client = require("../../index");
const {MessageEmbed, Collection} = require('discord.js')
const Timeout = new Collection();
const ms = require('ms')
const moment = require('moment')
moment.locale("tr")

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.reply({ content: "An error has occured " });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        if(cmd.cooldown) {
            if(Timeout.has(`slash-${cmd.name}-${interaction.user.id}`)) return interaction.reply({ content: `${turkishDate(Timeout.get(`slash-${cmd.name}-${interaction.user.id}`) - Date.now())} bekle` })
            if(!interaction.member.permissions.has(cmd.userPermissions || [])) return interaction.reply({ content: "Bu komutu kullanabilmek için yetkin yok"})
            if(!interaction.guild.me.permissions.has(cmd.botPermissions || [])) return interaction.reply({ content: "Bu komutu kullanabilmek için yetkin yok"})
            if(cmd.ownerOnly && !client.config.developer.includes(interaction.user.id.toString())) return interaction.reply({content: 'Bu komutu sadece Kurucu - Geliştirici ekibi gibi kişiler kullanabilr.'})
            cmd.run(client, interaction, args);
            Timeout.set(`slash-${cmd.name}-${interaction.user.id}`, Date.now() + cmd.cooldown*1000)
            setTimeout(async() => {
                Timeout.delete(`slash-${cmd.name}-${interaction.user.id}`)
            }, cmd.cooldown*1000)
        } else {
            if(!interaction.member.permissions.has(cmd.userPermissions || [])) return interaction.reply({ content: "Bu komutu kullanabilmek için yetkin yok"})
            if(!interaction.guild.me.permissions.has(cmd.botPermissions || [])) return interaction.reply({ content: "Bu komutu kullanabilmek için yetkim yok"})
            if(cmd.ownerOnly && !client.config.developer.includes(interaction.user.id.toString())) return interaction.reply({content: 'Bu komutu sadece Kurucu - Geliştirici ekibi gibi kişiler kullanabilr.'})
            cmd.run(client, interaction, args);
        }
    }

    if (interaction.isContextMenu()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;
        if(!interaction.member.permissions.has(command.userPermissions || [])) return interaction.reply({ content: "Bu komutu kullanabilmek için yetkin yok"})
        if(!interaction.guild.me.permissions.has(command.botPermissions || [])) return interaction.reply({ content: "Bu komutu kullanabilmek için yetkim yok"})
        if(command.ownerOnly && !client.config.developer.includes(interaction.member.id.toString())) return interaction.reply({content: 'Bu komutu sadece Kurucu - Geliştirici ekibi gibi kişiler kullanabilr.'})
        command.run(client, interaction);
    }
});