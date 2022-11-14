const { Client, CommandInteraction, MessageButton, MessageActionRow, MessageSelectMenu  } = require("discord.js");
const { Modal, TextInputComponent, showModal, SelectMenuComponent } = require('discord-modals')
const SecretRoom = require("../../models/SecretRoom");

module.exports = {
    name: "odaşifregiriş",
    description: "Özel odaya şifre ile giriş.",
    
    run: async (client, interaction, args) => {
    await interaction.deferReply({})
    const roomData = await SecretRoom.find({guild: interaction.guild.id})
    let channelList = [];
    roomData.forEach((channel) => {
        let channelData = client.channels.cache.get(channel.channel)
        channelList.push([{
            label: channelData.name + " - " + channelData.id, 
            emoji: "<:sohbet:1016110536552878171>", 
            description: `${channelData.name} isimli kanala girmek istiyorsan seç.`,
            value: channelData.id, 
        }])
    })
    let component = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId('odaşifregiriş2')
        .setPlaceholder('Hangi özel odaya girmek istiyorsan için seç.')
        .addOptions([
            channelList.slice(0, 25)
        ])
    )
    interaction.followUp({ components: [component] })
    

    },
};
