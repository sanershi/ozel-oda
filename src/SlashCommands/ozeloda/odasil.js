const { Client, CommandInteraction, MessageButton, MessageActionRow } = require("discord.js");
const { Modal, TextInputComponent, showModal, SelectMenuComponent } = require('discord-modals')
const SecretRoom = require("../../models/SecretRoom");


module.exports = {
    name: "odasil",
    description: "Size ait olan özel odayı silemnizi sağlar.",
    
    run: async (client, interaction, args) => {
        await interaction.deferReply({ephemeral: true})
        let roomData = await SecretRoom.findOne({user: interaction.user.id, guild: interaction.guild.id})
        if(!roomData) return interaction.followUp({content: "Silinecek bir odanız yok bulunamadı.", ephemeral: true})
        await SecretRoom.findOneAndDelete({user: interaction.user.id, guild: interaction.guild.id}) 
        interaction.followUp({content: "Özel oda başarıyla silindi.", ephemeral: true})
        let channel = client.channels.cache.get(roomData.channel)
        if(channel) channel.delete()
    },
};
