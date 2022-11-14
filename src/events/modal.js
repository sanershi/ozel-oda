const client = require("../../index");
const SecretRoom = require("../models/SecretRoom");

client.on("modalSubmit", async (modal) => {
    await modal.deferReply({ ephemeral: true })
    const odaisim = modal.getTextInputValue("odaisim")
    const odakapasite = modal.getTextInputValue("odakapasite") || 10
    if(odakapasite > 99) odakapasite = 10
    const odaşifre = modal.getTextInputValue("odaşifre")
    const idler = modal.getTextInputValue("idler") ? modal.getTextInputValue("idler").replace(", ", " ").split(" ") : ""
    const odaşifregiriş = modal.getTextInputValue("kanalşifre")
    const oda2 = client.channelPw
    const oda = modal.getTextInputValue("kanalid")
    const user = client.users.cache.get(modal.user.id)
    const member = modal.guild.members.cache.get(modal.user.id)
    const SecretData = await SecretRoom.findOne({ user: user.id, guild: modal.guild.id })
    if(isNaN(odakapasite)) return modal.followUp({ content: "Kapasite sayı olmalıdır.", ephemeral: true })
    if(modal.customId === 'özelodaşifreli') {
        if(SecretData) {
                if(SecretData.active === true) {
                    modal.followUp({ content: `Zaten bir özel odan var.`, ephemeral: true })
                    return
                } else {
                    SecretData.channelName = odaisim
                    SecretData.channel = channel.id
                    SecretData.channelCapacity = odakapasite
                    SecretData.channelPassword = odaşifre
                    SecretData.active = true
                    SecretData.save()
                }
        }
        modal.followUp({ content: `<:sohbet:1016110536552878171> **Özel oda oluşturuldu. İsmi: \`${odaisim}\` Kapasitesi: \`${odakapasite}\` Şifresi: \`${odaşifre}\`**`, ephemeral: true })
        modal.guild.channels.create(odaisim, {  
            reason: `${member.user.tag} özel oda.\nŞifre: ${odaşifre}`,
            type: 'GUILD_VOICE',
            userLimit: odakapasite,
            parent: '1017073726476521573',
            permissionOverwrites: [
                {
                    id: modal.user.id,  
                    allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
                },
                {
                    id: modal.guild.roles.everyone,
                    deny: ['CONNECT'],
                },
            ],
        }).then(async (channel) => {
        if(!SecretData) {
            new SecretRoom({
                user: user.id,
                guild: modal.guild.id,
                channelName: odaisim,
                channelCapacity: odakapasite,
                channelPassword: odaşifre,
                channel: channel.id,
                active: true
            }).save()
        } 
    })
    } else if(modal.customId === 'özelodaşifresiz') {
        if(SecretData) {
            if(SecretData.active === true) {
                modal.followUp({ content: `Zaten bir özel odan var.`, ephemeral: true })
                return
            } else {
                SecretData.channelName = odaisim
                SecretData.channel = channel.id
                SecretData.channelCapacity = odakapasite
                SecretData.active = true
                SecretData.save()
            }
    }
    modal.followUp({ content: `<:sohbet:1016110536552878171> **Özel oda oluşturuldu. İsmi: \`${odaisim}\` Kapasitesi: \`${odakapasite}\`**`, ephemeral: true })
    modal.guild.channels.create(odaisim, {  
        reason: `${member.user.tag} özel oda.`,
        type: 'GUILD_VOICE',
        userLimit: odakapasite,
        parent: '1016314520953700393',
        permissionOverwrites: [
            {
                id: modal.user.id,  
                allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
            },
            {
                id: modal.guild.roles.everyone,
                deny: ['CONNECT'],
            },
        ],
    }).then(async (channel) => {
    if(!SecretData) {
        new SecretRoom({
            user: user.id,
            guild: modal.guild.id,
            channelName: odaisim,
            channelCapacity: odakapasite,
            channel: channel.id,
            active: true,
            createdAt: Date.now()
        }).save()
    }
})
    } else if(modal.customId === "odaizin") {
    if(SecretData) {
        if(SecretData.active === false) {
            modal.followUp({ content: `Özel odan yok.`, ephemeral: true })
            return
        }
        modal.followUp({ content: `<:sohbet:1016110536552878171> **Özel odaya girebilicek kişileri ayarladım.**`, ephemeral: true })
        const channel = modal.guild.channels.cache.get(SecretData.channel)
        const SecretRoomData = await SecretRoom.findOne({ guild: modal.guild.id, channel: channel.id })
        const SecretRoomData2 = await SecretRoom.findOne({ user: user.id, guild: modal.guild.id })
        idler.forEach(async (id) => {
            const user = await client.users.fetch(id)
            channel.permissionOverwrites.create(user, {
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true
            })
            let veri = [...SecretRoomData.channelAuthorized].map(x => x.id).indexOf(user.id)
            let veri2 = [...SecretRoomData2.channelUnAuthorized].map(x => x.id).indexOf(user.id)
            if(veri === -1) {
                SecretRoomData.channelAuthorized.push({ id: user.id })
                SecretRoomData.save()
            }
            if(veri2 !== -1) {
                SecretRoomData2.channelUnAuthorized.splice(veri2, 1)
                SecretRoomData2.save()
            }
        })
    }
    
    } else if(modal.customId === "odaşifregiriş") {
        const SecretRoomData = await SecretRoom.findOne({ guild: modal.guild.id, channel: oda2 })
        if(!SecretRoomData) return modal.followUp({ content: `Böyle bir kanal bulunamadı.`, ephemeral: true })
        if(SecretRoomData.channelPassword !== odaşifregiriş) return modal.followUp({ content: `Şifre yanlış.`, ephemeral: true })
        const channel = modal.guild.channels.cache.get(SecretRoomData.channel)
        if(!channel) return modal.followUp({ content: `Böyle bir kanal bulunamadı.`, ephemeral: true })
        let channelUnAuthorized = [...SecretRoomData.channelUnAuthorized].map(x => x.id).indexOf(user.id)
        if(channelUnAuthorized !== -1) return modal.followUp({ content: `Bu kanala giremezsin.`, ephemeral: true })
        let veri = [...SecretRoomData.channelAuthorized].map(x => x.id).indexOf(user.id)
        if(veri === -1) {
            SecretRoomData.channelAuthorized.push({ id: user.id })
            SecretRoomData.save()
        } else {
           return modal.followUp({ content: `Zaten bu kanala girebilirsin.`, ephemeral: true })
        }
        channel.permissionOverwrites.create(user, {
            VIEW_CHANNEL: true,
            CONNECT: true,
            SPEAK: true
        })
        modal.followUp({ content: `<:sohbet:1016110536552878171> **Özel oda şifresi doğru <#${oda2}>.**`, ephemeral: true })
    } else if(modal.customId === "odaizinsil") {
        if(SecretData) {
            if(SecretData.active === false) {
                modal.followUp({ content: `Özel odan yok.`, ephemeral: true })
                return
            }
            modal.followUp({ content: `<:sohbet:1016110536552878171> **Özel odaya giremeyecek kişileri ayarladım.**`, ephemeral: true })
            const channel = modal.guild.channels.cache.get(SecretData.channel)
            const SecretRoomData = await SecretRoom.findOne({ guild: modal.guild.id, channel: channel.id })
            idler.forEach(async (id) => {
                const user = await client.users.fetch(id)
                if(!user) return
                channel.permissionOverwrites.create(user, {
                    CONNECT: false,
                    SPEAK: false
                })
                let veri = [...SecretRoomData.channelAuthorized].map(x => x.id).indexOf(user.id)
                if(veri !== -1) {
                    SecretRoomData.channelAuthorized.splice(veri, 1)
                    SecretRoomData.channelUnAuthorized.push({ id: user.id })
                    SecretRoomData.save()
                } else {
                    
                }
            })
        }
    }
})