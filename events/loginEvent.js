const osuPacket = require("osu-packet"),
    loginResponses = require("../constants/loginResponses"),
    log = require("../common/log"),
    userUtils = require("../common/tojiru/userUtils"),
    { query } = require("../common/db"),
    passwordUtils = require("../common/tojiru/passwordUtils"),
    countryUtils = require("../utils/countryUtils"),
    osuToken = require("../objects/player"),
    clientUtils = require("../utils/clientUtils"),
    playerUtils = require("../utils/playerUtils"),
    adminPrivileges = require("../common/constants/privileges"),
    banchoConfigUtils = require("../utils/banchoCfgUtil");

async function handle(req, res, data, headers) {
    // Create writer and parse the login data
    const Writer = new osuPacket.Bancho.Writer,
        loginData = data.toString("utf-8").split("\n"),
        username = loginData[0],
        passwordMD5 = loginData[1];

    // Check password sent is actually a valid MD5 hash.
    if (passwordMD5.length !== 32) {
        res.setHeader("cho-token", "Invalid");
        log.warning(username + " has just tried to login using invalid credentials")
        Writer.LoginReply(loginResponses.INVALID_CREDENTIALS);
        res.end(Writer.toBuffer);
        return;
    }

    let userData = await query("SELECT * FROM users WHERE username = ?", username);
    if (userData && userData.length) {
        let passwordCheck = await passwordUtils.comparePassword(passwordMD5, userData[0].password_md5);
        if (passwordCheck) {
            var securityInfo = loginData[2].split("|");

            var version = securityInfo[0];
            var timezoneOffset = parseInt(securityInfo[1]);
            var hardwareId = securityInfo[3];
            var osuBuild = 20131216;
            var parseableVersion = "";

            if (version.indexOf(".") > -1) {
                parseableVersion = version.substr(1, version.indexOf(".") - 1);
            }
            else {
                parseableVersion = version;
                parseableVersion.replace(/\D/g, "");
            }

            try {
                osuBuild = parseInt(parseableVersion);
            }
            catch (ex) {
                // Couldn't parse osu! client version
                res.setHeader("cho-token", "NOCLIENT");
                writer.LoginReply(loginResponses.SERVER_ERROR);
                res.end(writer.toBuffer);
                return
            }

            var client = clientUtils.findClient(version, osuBuild)
            let ip = headers['X-Real-IP'];
            if (ip === "127.0.0.1" || ip === '0.0.0.0')
                ip = headers['X-Forwarded-For'];
            if (ip === "127.0.0.1" || ip === '0.0.0.0')
                ip = '';

            let countryId = 0,
                longitude = 0,
                latitude = 0;
            if (require("../config.json").localize.enable) {
                let ipData = await require("../utils/ipUtils")(ip);
                countryId = countryUtils.getCountryID(ipData.country);
                longitude = ipData.loc.split(',')[0];
                latitude = ipData.loc.split(',')[1];
            } else {
                countryId = countryUtils.getCountryID("A2")
            }

            // Calculate peppy privileges
            let banchoPrivileges = 1;
            if (Boolean(userData[0].privileges & adminPrivileges.ADMIN_MANAGE_BEATMAPS)) {
                banchoPrivileges |= 2
            }
            // Add free supporter
            let freeDirect = banchoConfigUtils.findValue("free_direct");
            if (freeDirect.value_int == 1) {
                banchoPrivileges |= 4;
            }

            if (Boolean(userData[0].privileges & adminPrivileges.USER_TOURNAMENT_STAFF)) {
                banchoPrivileges |= 32;
            }
            if (!Boolean(userData[0].privileges & adminPrivileges.ADMIN_MANAGE_SERVERS)) {
                Writer.Announce("You can't connect to Asuki, if you aren't Admin")
                res.setHeader("cho-token", "NOADMIN");
                writer.LoginReply(loginResponses.SERVER_ERROR);
                res.end(writer.toBuffer);
                return
            }


            let player = new osuToken(userData, timezoneOffset, countryId, banchoPrivileges, longitude, latitude);
            global.players.push(player);
            res.setHeader("cho-token", player.token);
            // Send client lock
          //  Writer.BanInfo(0);
            // Send Account Restricted
           // Writer.AccountRestricted();
            // Send bancho protocol version
            Writer.ProtocolNegotiation(19);
            // Send login success with users' id
            Writer.LoginReply(userData[0].id);
            // Send users' permissions
            Writer.LoginPermissions(banchoPrivileges);
            // Send main menu news image.
            Writer.TitleUpdate("https://i.ppy.sh/b361683ebd1a8c694942cf3b5ea0cab31f84e4f7/68747470733a2f2f7075752e73682f44585943772f353365383965393933302e706e67|https://www.twitch.tv/osulive");
            // Send friends list
            let friendsList = [999];
            let friends = await query("SELECT user2 FROM users_relationships WHERE user1 = ?", userData[0].id);
            friends.forEach(friend => {
                friendsList.push(friend);
            })
            Writer.FriendsList(friendsList);
            await playerUtils.updateCachedStats(userData[0].id, 0, 0);
            Writer.UserPresence({
                userId: userData[0].id,
                username: username,
                timezone: player.presence.timezone,
                countryId: player.presence.countryId,
                permissions: 6,
                longitude: player.presence.longitude,
                latitude: player.presence.latitude,
                rank: player.status.rank
            })
            Writer.HandleOsuUpdate({
                userId: userData[0].id,
                status: player.status.status,
                statusText: player.status.statusText,
                beatmapChecksum: player.status.beatmap.beatmapChecksum,
                currentMods: player.status.beatmap.currentMods,
                playMode: player.status.beatmap.playMode,
                beatmapId: player.status.beatmap.beatmapId,
                rankedScore: player.status.rankedScore,
                accuracy: player.status.accuracy,
                playCount: player.status.playCount,
                totalScore: player.status.totalScore,
                rank: player.status.rank,
                performance: player.status.performance,

            })
            let onlineUsers = [];
            global.players.forEach(user => {
                onlineUsers.push(user.info.userID)

                Writer.UserPresence({
                    userId: user.info.userID,
                    username: user.info.username,
                    timezone: user.presence.timezone,
                    countryId: user.presence.countryId,
                    permissions: user.presence.permissions,
                    longitude: user.presence.longitude,
                    latitude: user.presence.latitude,
                    rank: user.status.rank,
                });
            })
            Writer.UserPresenceBundle(onlineUsers)
            Writer.ChannelJoinSuccess("#osu");
            Writer.ChannelJoinSuccess("#announce");

            global.channels.forEach(channel => {
                Writer.ChannelAvailable({
                    channelName: channel.name,
                    channelTopic: channel.description,
                    channelUserCount: channel.joinedPlayers.length
                })
            })
            Writer.ChannelListingComplete();



            log.info(username + " has just logged in")
        } else {
            res.setHeader("cho-token", "Invalid");
            log.warning(username + " has just tried to login using the wrong password")
            Writer.LoginReply(loginResponses.INVALID_CREDENTIALS);
            res.end(Writer.toBuffer);
            return;
        }
    } else {
        res.setHeader("cho-token", "Invalid");
        log.warning(username + " has just tried to login using the wrong username")
        Writer.LoginReply(loginResponses.INVALID_CREDENTIALS);
        res.end(Writer.toBuffer);
        return;
    }

    res.end(Writer.toBuffer)
}


module.exports = handle;