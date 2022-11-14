const { Client, CommandInteraction, MessageButton, MessageActionRow } = require("discord.js");
const { Modal, TextInputComponent, showModal, SelectMenuComponent } = require('discord-modals')
const SecretRoom = require("../../models/SecretRoom");

module.exports = {
    name: "odaizinsil",
    description: "Özel odaya girebilen kişilerin idlerini girin.",
    
    run: async (client, interaction, args) => {
    const modal = new Modal() 
	.setCustomId('odaizinsil')
	.setTitle('Özel oda izin sil panel')
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
