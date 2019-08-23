const { query } = require("../common/db"),
    osuPacket = require("osu-packet"),
    loginResponses = require("../constants/loginResponses"),
    playerUtils = require("../utils/playerUtils");

async function handle(res, data, token) {
    const reader = new osuPacket.Client.Reader(data);
    const writer = new osuPacket.Bancho.Writer(data);
    const currentPlayer = playerUtils.getPlayerByToken(token);
    if (currentPlayer == undefined) {
        writer.LoginReply(loginResponses.SERVER_ERROR);
        writer.Announce("Server error");
        res.end(writer.toBuffer);
        return
    }

    const PacketData = reader.Parse();
    for (let i = 0, len = PacketData.length; i < len; i++) {
        let Packet = PacketData[i];
        switch (Packet.id) {
            case 0:
                require("../events/updateActionEvent")(token, Packet.data);
                break;
            case 1:
                if (Packet.data.message.startsWith("!")) {
                    require("../constants/commands")(token, Packet.data);
                }
                require("../events/sendPublicMessageEvent")(token, Packet.data);
                break;
            case 2:
                require("../events/logoutEvent")(token, Packet.data);
                break;
            case 3:
                require("../events/requestStatusEvent")(token)
                break;
            case 4:
                break;
            case 25:
                require("../events/sendPrivateMessageEvent")(token, Packet.data)
                break;
            case 63:
                require('../events/joinChannelEvent')(token, Packet.data);
                break;
            case 73:
                require('../events/addFriendEvent')(token, Packet.data);
                break;
            case 74:
                require('../events/removeFriendEvent')(token, Packet.data);
                break;
            case 78:
                require('../events/leaveChannelEvent')(token, Packet.data);
                break;
            case 85:
                require('../events/bundlePresenceEvent')(token)
                require("../events/requestStatusEvent")(token)
                break;
            case 97:
                Packet.data.forEach(id => {
                    require('../events/presenceRequestEvent')(token, id)
                })
                break;

            default:
                console.dir(Packet);
                break;
        }
    }
    let buffer_data = currentPlayer.queue.read() || Buffer.alloc(0);
    res.end(Buffer.concat([writer.toBuffer, buffer_data]));
}

module.exports = handle;