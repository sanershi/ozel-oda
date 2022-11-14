const client = require("../../index");
const { Modal, TextInputComponent, showModal, SelectMenuComponent } = require('discord-modals')
const SecretRoom = require("../models/SecretRoom");

client.on("ready", () => {
    client.user.setPresence({ activity: { name: client.config.activity }, status: client.config.status });
    logger.log('Client Bağlantısı kuruldu.', 'success');
    let guild = client.guilds.cache.get(client.config.sunucu)
    if(guild) guild.members.fetch()
    client.on('interactionCreate', async(interaction) => {
        if(interaction.user.bot) return;
        if(interaction.isButton()) {
            if(interaction.customId ? interaction.customId.includes("-giriş") : null) {
                const channel = client.channels.cache.get(interaction.customId.replace("-giriş", ""))
                if(!channel) return interaction.reply({ content: "Böyle bir kanal bulunamadı.", ephemeral: true })
                if(channel.type !== "GUILD_VOICE") return interaction.reply({ content: "Bu kanal bir ses kanalı değil.", ephemeral: true })
                const roomData = await SecretRoom.findOne({channel: channel.id})
                const SecretRoomData = await SecretRoom.findOne({ guild: interaction.guild.id, channel: channel.id })
                const SecretRoomData2 = await SecretRoom.findOne({  guild: interaction.guild.id, channel: channel.id })
                if(!roomData) return interaction.reply({ content: "Böyle bir kanal \"VERİMERKEZİNDE\" bulunamadı.", ephemeral: true })
                channel.permissionOverwrites.create(interaction.user, {
                    VIEW_CHANNEL: true,
                    CONNECT: true,
                    SPEAK: true
                })
                let veri = [...SecretRoomData.channelAuthorized].map(x => x.id).indexOf(interaction.user.id)
                let veri2 = [...SecretRoomData2.channelUnAuthorized].map(x => x.id).indexOf(interaction.user.id)
                if(veri === -1) {
                    SecretRoomData.channelAuthorized.push({ id: interaction.user.id })
                    SecretRoomData.save()
                }
                if(veri2 !== -1) {
                    SecretRoomData2.channelUnAuthorized.splice(veri2, 1)
                    SecretRoomData2.save()
                }
                return interaction.reply({ content: "Kanala erişiminiz açıldı", ephemeral: true })
            }
        }
        if(interaction.isSelectMenu()) {
            if(interaction.customId === "odaşifregiriş2") {
                const channel = interaction.values[0]
                const modal = new Modal()
                .setCustomId(`odaşifregiriş`)
                .setTitle(`Özel oda şifresi gir`)
                .addComponents(
                  new TextInputComponent()
                  .setCustomId(`kanalşifre`)
                  .setLabel('Özel oda şifresini yazın.')
                  .setStyle('SHORT')
                  .setMinLength(1)
                  .setMaxLength(4000)
                  .setPlaceholder('Buraya giriniz')
                  .setRequired(true),
                );
                showModal(modal, { client, interaction });
                client.channelPw = channel
            }
        }
        if(interaction.customId === "evet") {
            const modal = new Modal()
            .setCustomId('özelodaşifreli')
            .setTitle('Özel oda paneli.')
            .addComponents(
              new TextInputComponent()
              .setCustomId('odaisim')
              .setLabel('Özel odanızın ismi.')
              .setStyle('SHORT')
              .setMinLength(1)
              .setMaxLength(100)
              .setPlaceholder('Buraya giriniz')
              .setRequired(true),
              new TextInputComponent()
              .setCustomId('odakapasite')
              .setLabel('Özel oda kapasite')
              .setStyle('SHORT')
              .setMinLength(1)
              .setMaxLength(2)
              .setPlaceholder('Buraya giriniz')
              .setRequired(true),
              new TextInputComponent()
              .setCustomId('odaşifre')
              .setLabel('Özel oda şifre')
              .setStyle('SHORT')
              .setMinLength(2)
              .setMaxLength(4000)
              .setPlaceholder('Buraya giriniz')
              .setRequired(true),
            );
            showModal(modal, { client, interaction });
        } else {
            if(interaction.customId === "hayır") {
                const modal = new Modal()
                .setCustomId('özelodaşifresiz')
                .setTitle('Özel oda paneli.')
                .addComponents(
                  new TextInputComponent()
                  .setCustomId('odaisim')
                  .setLabel('Özel odanızın ismi.')
                  .setStyle('SHORT')
                  .setMinLength(1)
                  .setMaxLength(100)
                  .setPlaceholder('Buraya giriniz')
                  .setRequired(true),
                  new TextInputComponent()
                  .setCustomId('odakapasite')
                  .setLabel('Özel oda kapasite')
                  .setStyle('SHORT')
                  .setMinLength(2)
                  .setMaxLength(2)
                  .setPlaceholder('Buraya giriniz')
                  .setRequired(true),
                );
                showModal(modal, { client, interaction });
            }
        }
    })
})