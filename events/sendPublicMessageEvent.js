const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet"),
    log = require("../common/log");



function handle(token, data) {
    const writer = new osuPacket.Bancho.Writer;
    const player = playerUtils.getPlayerByToken(token);
    global.channels.forEach(channel => {
        if (channel.name == data.target && channel.name != "#announce") {
            writer.SendMessage({
                sendingClient: player.info.username,
                message: data.message,
                target: channel.name,
                senderId: player.info.userID
            });
        }
    })

    if (data.target.startsWith("#mp_")) {
        writer.SendMessage({
            sendingClient: player.info.username,
            message: data.message,
            target: channel.name,
            senderId: player.info.userID
        });
    }
    global.players.forEach(user => {
        if (user.info.userID != player.info.userID) {
            user.enqueue(writer.toBuffer)
        }
    })
    log.info(player.info.username + " (" + data.target + ") => " + data.message);
}

module.exports = handle;