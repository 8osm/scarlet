const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet");



function handle(token, data) {
    const writer = new osuPacket.Bancho.Writer;
    for (let i = 0; i < global.players.length; i++) {
        if (global.players[i].token == token) {
            writer.HandleUserQuit({
                userId: global.players[i].info.userID,
                state: 0
            });
            global.players.splice(i, 1);
        }
    }
    global.players.forEach(player => {
        player.enqueue(writer.toBuffer)
    })
}

module.exports = handle;