const { Client, CommandInteraction, MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const { Modal, TextInputComponent, showModal, SelectMenuComponent, InteractionResponseTypes } = require('discord-modals')
const SecretRoom = require("../../models/SecretRoom");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

module.exports = {
    name: "odabilgi",
    description: "Verilen oda idsine ait odanın bilgilerini gösterir.",
    userPermissions: ["ADMINISTRATOR"],
    options: [{
        name: "kanalid",
        description: "Oda hakkında bilgi almak istediğniz odanın idsini yazın.",
        type: "STRING",
        required: true
    }],
    
    run: async (client, interaction, args) => {
        await interaction.deferReply({ephemeral: true})
        const roomId = interaction.options.getString('kanalid')
        const roomData = await SecretRoom.findOne({channel: roomId, guild: interaction.guild.id})
        if(!roomData) return interaction.followUp({content: "Böyle bir oda bulunamadı.", ephemeral: true})
        const roomUser = await client.users.fetch(roomData.user)
        const roomChannel = await client.channels.fetch(roomData.channel)
        const roomCapacity = roomChannel.userLimit
        const giriş = new MessageButton()
        .setCustomId(`${roomChannel.id}-giriş`)
        .setLabel('Odaya giriş yap')
        .setStyle('SUCCESS')
        const row = new MessageActionRow()
        .addComponents(giriş)
        const embed = new MessageEmbed()
        .setAuthor({ name: roomUser.tag + " Özel odasının bilgileri.", iconURL: roomUser.avatarURL({dynamic: true})})
        .setColor("BLURPLE")
        .setDescription(`**Oda Sahibi:** ${roomUser.tag} (\`${roomUser.id}\`)`)
        .addFields({ name: "Oda bilgileri", value: `<:kii:1016110538104770570> \`Oda Sahibi:\` **${roomUser.tag}** \`${roomUser.id}\`\n<:ses:1016110535231676416> \`Oda ismi:\` **[${roomChannel.name}](https://discord.com/channels/${interaction.guild.id}/${roomData.channel})**\n<:ses:1016110535231676416> \`Oda kapasitesi:\` **${roomCapacity}**\n${roomData.channelPassword ? `<:ses:1016110535231676416> \`Oda şifresi:\` **${roomData.channelPassword}**` : ""}\n<:date:1016437897223749723> \`Oda oluşturulma tarihi:\` <t:${moment(roomData.createdAt).unix()}>` })
        .addFields({ name: "Oda durumu", value: `<:online:1016110535231676416> \`Oda durumu:\` **${roomChannel.members.size}/${roomCapacity}**\n${roomChannel.members.size >= 1 ? roomChannel.members.map((member) => {
                const member2 = interaction.guild.members.cache.get(member.id)
                return `<:kii:1016110538104770570> \`${member.user.tag}\` ${member.voice.mute ? "<:muted:1016447109727264859>" : "<:ses:1016110535231676416>"}${member.voice.deaf ? "<:abo:1016447112654889030>" : "<:headphone:1016447111014916117>"}`
        }) : ""}` })
        interaction.followUp({ embeds: [embed], components: [row] })
    },
};
