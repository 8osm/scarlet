const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet"),
    log = require("../common/log");



function handle(token, target) {
    const writer = new osuPacket.Bancho.Writer;
    const player = playerUtils.getPlayerByToken(token);
    global.channels.forEach(channel => {
        if (channel.name == target) {
            writer.ChannelRevoked(target);
        }
    })
    log.info(player.info.username + " has left channel " + target)
    player.enqueue(writer.toBuffer)
}

module.exports = handle;