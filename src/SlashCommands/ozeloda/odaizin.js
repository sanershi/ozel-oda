const { Client, CommandInteraction, MessageButton, MessageActionRow } = require("discord.js");
const { Modal, TextInputComponent, showModal, SelectMenuComponent } = require('discord-modals')

module.exports = {
    name: "odaizin",
    description: "Özel odaya girebilicek kişilerin idlerini girin.",
    
    run: async (client, interaction, args) => {
    const modal = new Modal() 
	.setCustomId('odaizin')
	.setTitle('Özel oda izin panel')
	.addComponents(
    new TextInputComponent() 
        .setCustomId('idler')
        .setLabel('Odaya girebilicek kişilerin idleri')
        .setStyle('SHORT') 
        .setPlaceholder('1012359798253174926, 1016315369012600963')
        .setRequired(true), 
	);
    showModal(modal, {
        client: client, 
        interaction: interaction,
    });
    },
};
