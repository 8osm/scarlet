const { query } = require("../common/db"),
    osuPacket = require('osu-packet');

async function handle(token, data) {
    const player = require('../utils/playerUtils').getPlayerByToken(token);
    if (query(`SELECT * FROM users_relationships WHERE user1=${player.info.userID} AND user2=${data}`)) {
        await query(`DELETE FROM users_relationships WHERE user1=${player.info.userID} AND user2=${data}`);
    }
}

module.exports = handle;
