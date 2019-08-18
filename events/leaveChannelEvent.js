const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet"),
    log = require("../common/log"),
    channelUtils = require("../utils/channelUtils")



function handle(token, target) {
    const writer = new osuPacket.Bancho.Writer;
    const player = playerUtils.getPlayerByToken(token);
    channel = channelUtils.findChannelByName(target);
    if (channel != null) {
        for (let i = 0; i < channel.joinedPlayers.legnth; i++) {
            if (channel.joinedPlayers[i] == player.info.userID) {
                channel.joinedPlayers.splice(i, 1);
            }
        }
        writer.ChannelRevoked(target)
        log.info(player.info.username + " has parted with " + target);
    } else {
        log.info(player.info.username + " has tried to part with a channel that doesn't exist (" + target + ")")
    }
    player.enqueue(writer.toBuffer)
}

module.exports = handle;