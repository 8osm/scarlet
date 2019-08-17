const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet"),
    log = require("../common/log");



function handle(token, target) {
    const writer = new osuPacket.Bancho.Writer;
    const player = playerUtils.getPlayerByToken(token);
    global.channels.forEach(channel => {
        if (channel.name == target) {
            writer.ChannelJoinSuccess(target);
            log.info(player.info.username + " has joined channel " + target)
        }
    })
    let realChannel = false;
    for (i in global.channels) {
        if (global.channels[i].name == target) {
            if (target == "#admin" && player.presence.permissions < 7) {
                realChannel = false;
            } else {
                realChannel = true;
            }

        }
    }

    if (realChannel == false) {
        writer.ChannelRevoked(target)
    }


    player.enqueue(writer.toBuffer)
}

module.exports = handle;