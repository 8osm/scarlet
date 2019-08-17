const playerUtils = require("../utils/playerUtils"),
    osuPacket = require("osu-packet");



function handle(token, id) {
    const writer = new osuPacket.Bancho.Writer;
    const player = playerUtils.getPlayerByToken(token);
    let user = playerUtils.getPlayerById(id);
    const userId = user.info.userID;
    const username = user.info.username;
    const presence = user.presence;

    if (presence.timezone < 0) presence.timezone = 0 + 24;
    if (presence.countryId < 0) presence.countryId = 0;
    if (presence.permissions < 0) presence.permissions = 0;
    if (presence.longitude < 0) presence.longitude = 0;
    if (presence.latitude < 0) presence.latitude = 0;
    if (user.status.rank < 0) user.status.rank = 0;

    writer.UserPresence({
        userId: userId,
        username: username,
        timezone: presence.timezone,
        countryId: presence.countryId,
        permissions: presence.permissions,
        longitude: presence.longitude,
        latitude: presence.latitude,
        rank: user.status.rank
    });
    player.enqueue(writer.toBuffer)
}

module.exports = handle;