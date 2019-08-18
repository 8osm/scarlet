const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet"),
    log = require("../common/log"),
    privileges = require("../common/constants/privileges"),
    { query } = require("../common/db");



async function handle(token, data) {
    const player = playerUtils.getPlayerByToken(token);
    let message = data.message;

    const prefix = "!";

    // parsing message
    if (!message.startsWith(prefix))
        return;

    let args = message.split(" ");
    let command = args.shift();
    command = command.substr(1, command.length);

    switch (command.toLowerCase()) {
        case "alert":
            if (Boolean(player.info.privileges & privileges.ADMIN_ACCESS_RAP)) {
                alert(args.join(" "))
            }
            break;
        case "last":
            await last(player, args, data.target);
            break;
        default:
            notCommand(command, data.target)
            break;
    }
    return;
}
function notCommand(command, target) {
    const writer = new osuPacket.Bancho.Writer;
    writer.SendMessage({
        sendingClient: "Scarlet",
        message: command + " is not a command.",
        target: target,
        senderId: 999
    })
    global.players.forEach(user => {
        user.enqueue(writer.toBuffer);
    })
    return;
}

function alert(message) {
    const writer = new osuPacket.Bancho.Writer;
    writer.Announce(message);
    global.players.forEach(user => {
        user.enqueue(writer.toBuffer);
    })
    return;
}

async function last(user, args, target) {
    const writer = new osuPacket.Bancho.Writer;
    let scoresAdd = "";

    if (args.length && args[0].toLowerCase() == "relax") {
        scoresAdd = "_rx"
    } else if (args.length && args[0].toLowerCase() == "autopilot") {
        scoresAdd = "_auto"
    } else {
        scoresAdd = ""
    }
    let q = await query(`SELECT * FROM scores${scoresAdd} INNER JOIN beatmaps ON beatmaps.beatmap_md5 = scores${scoresAdd}.beatmap_md5 WHERE userid = ? ORDER BY time DESC LIMIT 2`, user.info.userID);
    writer.SendMessage({
        sendingClient: "Scarlet",
        message: "Your last score was on [http://osu.ppy.sh/b/" + q[0].beatmap_id + " " + q[0].song_name + "], achieving " + q[0].pp + "pp.",
        target: target,
        senderId: 999
    })
    global.players.forEach(user => {
        user.enqueue(writer.toBuffer);
    })
}

module.exports = handle;