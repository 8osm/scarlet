const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet"),
    log = require("../common/log");



function handle(token, data) {
    const writer = new osuPacket.Bancho.Writer,
    user = playerUtils.getPlayerByToken(token);
    let reason ="";
    
    if (data == 1) {
        reason = "update";
    } else {
        reason = "quit";
    }
    log.info(user.info.username + " killed for " + reason);

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