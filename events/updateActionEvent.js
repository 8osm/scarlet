const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet");

function handle(token, packetData) {
    const user = playerUtils.getPlayerByToken(token);
    const writer = new osuPacket.Bancho.Writer;
    if (user) {
        user.status.status = packetData.status;
        user.status.beatmap.beatmapChecksum = packetData.beatmapChecksum;
        user.status.beatmap.currentMods = packetData.currentMods;
        user.status.beatmap.playMode = packetData.playMode;
        user.status.beatmap.beatmapId = packetData.beatmapId;
        let type;
        if (Boolean(packetData.currentMods & 128)) {
            type = 1
            user.status.statusText = packetData.statusText + "with Relax";
            user.usingRelax = true;
            if (!user.announceRelax) {
                user.announceRelax = true;
                writer.Announce('You have enabled Relax, leaderboards will be set to relax leaderboards.');
            }
        } else {
            type = 0
            user.usingRelax = false;
            user.status.statusText = packetData.statusText;
            if (user.announceRelax) {
                user.announceRelax = false;
                writer.Announce('You have disabled Relax, leaderboards will be back to normal.');
            }
        }
        playerUtils.updateCachedStats(user.info.userID, packetData.playMode, type);
        require("./requestStatusEvent")(token)
        user.enqueue(writer.toBuffer)
    }
}

module.exports = handle;