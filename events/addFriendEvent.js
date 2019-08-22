const osuPacket = require("osu-packet")

async function handle(token, data) {
    console.log(`token: ${token}\ndata: ${data}`);
    await query(("INSERT INTO users_relationships (user1, user2) VALUES (%s, %s)", [token.userID, friendId]))
}

module.exports = handle;
