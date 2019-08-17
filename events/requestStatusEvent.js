const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet");



function handle(token) {
    const writer = new osuPacket.Bancho.Writer;
    const player = playerUtils.getPlayerByToken(token);
    global.players.forEach(user => {
        writer.HandleOsuUpdate({
            userId: user.info.userID,
            status: user.status.status,
            statusText: user.status.statusText,
            beatmapChecksum: user.status.beatmap.beatmapChecksum,
            currentMods: user.status.beatmap.currentMods,
            playMode: user.status.beatmap.playMode,
            beatmapId: user.status.beatmap.beatmapId,
            rankedScore: user.status.rankedScore,
            accuracy: user.status.accuracy,
            playCount: user.status.playCount,
            totalScore: user.status.totalScore,
            rank: user.status.rank,
            performance: user.status.performance
        })
    })

    player.enqueue(writer.toBuffer)
}

module.exports = handle;