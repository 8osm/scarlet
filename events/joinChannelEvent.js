const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet"),
    log = require("../common/log"),
    privileges = require("../common/constants/privileges"),
    channelUtils = require("../utils/channelUtils");



function handle(token, target) {
    const writer = new osuPacket.Bancho.Writer,
    player = playerUtils.getPlayerByToken(token),
    channel = channelUtils.findChannelByName(target);
    if (channel != null) {
        if (channel.hidden && !Boolean(player.info.privileges & privileges.ADMIN_ACCESS_RAP)) {
            writer.ChannelRevoked(target)
            log.info(player.info.username + " has tried to join a channel they dont have access to (" + target + ")");
        } else {
            writer.ChannelJoinSuccess(target);
            log.info(player.info.username + " has successfully joined a channel (" + target + ")")
        }
        channel.joinedPlayers.push(player.info.userID)
    } else {
        writer.ChannelRevoked(target)
        log.info(player.info.username + " has tried to join a channel that doesn't exist (" + target + ")")
    }

    player.enqueue(writer.toBuffer)
}

module.exports = handle;