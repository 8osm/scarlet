const { query } = require("../common/db"),
    modeUtils = require("../common/constants/gameModes")
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
        ranked_score_${gm}_rx AS rankedScore,
        avg_accuracy_${gm}_rx AS accuracy,
        playcount_${gm}_rx AS playcount,
        total_score_${gm}_rx AS totalScore,
        pp_${gm}_rx AS pp
        FROM users_stats WHERE id = ?`, player.info.userID)
    } else if (type == 2) {
        q = await query(`SELECT
        ranked_score_${gm}_ap AS rankedScore,
        avg_accuracy_${gm}_ap AS accuracy,
        playcount_${gm}_ap AS playcount,
        total_score_${gm}_ap AS totalScore,
        pp_${gm}_auto AS pp
        FROM users_stats WHERE id = ?`, player.info.userID)
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

module.exports = {
    getPlayerByToken,
    getPlayerById,
    getPlayerByName,
    updateCachedStats,
    getPlayerLobby
}