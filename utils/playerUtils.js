const { query } = require("../common/db"),
    modeUtils = require("../common/constants/gameModes"),
    privileges = require("../common/constants/privileges");

function getPlayerByToken(token) {
    for (let i = 0; i < global.players.length; i++) {
        if (global.players[i].token == token) {
            return global.players[i]
        }
    }
}

function getPlayerById(id) {
    for (let i = 0; i < global.players.length; i++) {
        if (global.players[i].info.userID == id) {
            return global.players[i]
        }
    }
}
function getPlayerByName(name) {
    for (let i = 0; i < global.players.length; i++) {
        if (global.players[i].info.username == name) {
            return global.players[i]
        }
    }
}

async function updateCachedStats(id, mode, type) {
    let player = getPlayerById(id);
    let gm = modeUtils.getGamemodeForDB(mode);
    let q;
    if (type == 1) {
        q = await query(`SELECT
        ranked_score_${gm} AS rankedScore,
        avg_accuracy_${gm} AS accuracy,
        playcount_${gm} AS playcount,
        total_score_${gm} AS totalScore,
        pp_${gm} AS pp
        FROM relax_stats WHERE id = ?`, player.info.userID)
    /*} else if (type == 2) {
        q = await query(`SELECT
        ranked_score_${gm}_ap AS rankedScore,
        avg_accuracy_${gm}_ap AS accuracy,
        playcount_${gm}_ap AS playcount,
        total_score_${gm}_ap AS totalScore,
        pp_${gm}_auto AS pp
        FROM users_stats WHERE id = ?`, player.info.userID) */
    } else {
        q = await query(`SELECT
        ranked_score_${gm} AS rankedScore,
        avg_accuracy_${gm} AS accuracy,
        playcount_${gm} AS playcount,
        total_score_${gm} AS totalScore,
        pp_${gm} AS pp
        FROM users_stats WHERE id = ?`, player.info.userID)
    }
    if (q && q.length) {
        player.status.rankedScore = q[0].rankedScore;
        player.status.accuracy = q[0].accuracy / 100;
        player.status.playCount = q[0].playcount;
        player.status.totalScore = q[0].totalScore;
        player.status.performance = q[0].pp;
        player.status.rank = await calculateRank(id, mode, type)
    } else {
        return false;
    }
}

async function getID(username) {
    let q = await query("SELECT id FROM users WHERE username = ?", username);
    return q[0].id
}

function getPlayerLobby(id) {
    for (let i = 0; i < global.multiplayerLobbies.length; i++) {
        const currentLobby = global.multiplayerLobbies[i];
        const lobbySlots = currentLobby.slots;
        for (let j = 0; j < lobbySlots.length; j++) {
            const currentSlot = lobbySlots[j];
            if (currentSlot.playerId == id) {
                return i
            }
        }
    }
}

async function calculateRank(id, mode, type) { // Too lazy for redis
    let gm = modeUtils.getGamemodeForDB(mode),
        ppAdd = "";
    if (type == 1) {
        ppAdd = "relax";
    } else {
        ppAdd = "users";
    }
    let q = await query(`SELECT * FROM ${ppAdd}_stats INNER JOIN users ON users.id=${ppAdd}_stats.id WHERE users.privileges & 1 > 0
                        ORDER BY ${ppAdd}_stats.pp_${gm} DESC;`);

    for (let i = 0; i < q.length; i++) {
        if (q[i].id == id) {
            return i + 1;
        }
    }
}

module.exports = {
    getPlayerByToken,
    getPlayerById,
    getPlayerByName,
    updateCachedStats,
    getPlayerLobby,
    calculateRank
}