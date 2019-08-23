const { query } = require("../common/db");

async function handle(token, data) {
    const player = require('../utils/playerUtils').getPlayerByToken(token);
    if (!query(`SELECT * FROM users_relationships WHERE user1 = ${player.info.userID} AND user2 = ${data}`)) {
        await query(`INSERT INTO users_relationships (user1, user2) VALUES (${player.info.userID}, ${data})`);
    }
}

module.exports = handle;
