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
            user.status.statusText = packetData.statusText + " with Relax";
            user.usingRelax = true;
            if (!user.announceRelax) {
                user.announceRelax = true;
                user.announceAP = false;
                writer.Announce('You have enabled Relax, leaderboards will be set to relax leaderboards.');
            }
        } else if (Boolean(packetData.currentMods & 8192)) {
            type = 2
            user.status.statusText = packetData.statusText + " with AutoPilot";
            user.usingAuto = true;
            if (!user.announceAP) {
                user.announceRelax = false;
                user.announceAP = true;
                writer.Announce('You have enabled AutoPilot, leaderboards will be set to AutoPilot leaderboards.');
            }
        } else {
            type = 0
            user.usingRelax = false;
            user.usingAuto = false;
            user.status.statusText = packetData.statusText;
            if (user.announceRelax || user.announceAP) {
                user.announceRelax = false;
                user.announceAP = false;
                writer.Announce('You have disabled either AutoPilot or Relax, leaderboards will be back to normal.');
            }
        }
        playerUtils.updateCachedStats(user.info.userID, packetData.playMode, type);
        require("./requestStatusEvent")(token)
        user.enqueue(writer.toBuffer)
    }
}

module.exports = handle;