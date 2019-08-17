const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet");



function handle(token) {
    const writer = new osuPacket.Bancho.Writer;
    const player = playerUtils.getPlayerByToken(token);
    let players = [];

    for (let i = 0; i < global.players.length; i++) {
        if (global.players[i].info.userID != player.info.userID) {
            players.push(global.players[i].info.userID);
        }
    }
    writer.UserPresenceBundle(players);
    player.enqueue(writer.toBuffer)
}

module.exports = handle;