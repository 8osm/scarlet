const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet");



function handle(token, data) {
    const writer = new osuPacket.Bancho.Writer;
    const writerLocal = new osuPacket.Bancho.Writer;
    const player = playerUtils.getPlayerByToken(token);
    const playerToSend = playerUtils.getPlayerByName(data.target);
    if (playerToSend && playerToSend.info.userID != 999) {
        writer.SendMessage({
            sendingClient: player.info.username,
            message: data.message,
            target: data.target,
            senderId: player.info.userID
        });
    } else {
        writerLocal.Announce("I am the bot, currently there's no commands.")
    }

    playerToSend.enqueue(writer.toBuffer)
    player.enqueue(writerLocal.toBuffer);
}

module.exports = handle;