const { Client, CommandInteraction, MessageButton, MessageActionRow } = require("discord.js");
const { Modal, TextInputComponent, showModal, SelectMenuComponent } = require('discord-modals')

module.exports = {
    name: "odaoluştur",
    description: "Özel oda oluşturabilmeniz için gerekli komut.",
    
    run: async (client, interaction, args) => {
        await interaction.deferReply({ephemeral: true})
        const evet = new MessageButton()
        .setCustomId('evet')
        .setLabel('Evet')
        .setStyle('SUCCESS')
        const hayır = new MessageButton()
        .setCustomId('hayır')
        .setLabel('Hayır')
        .setStyle('DANGER')
        const row= new MessageActionRow()
        .addComponents(evet, hayır)
        interaction.followUp({ content: "Özel odanızda şifre olsun mu?", components: [row], ephemeral: true })
    },
};
