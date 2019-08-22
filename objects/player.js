const uuid = require("uuid"),
    { PassThrough } = require("stream");


class Player {
    constructor(userData, timezone, countryId, permissions, longitude, latitude) {
        this.queue = new PassThrough();
        this.info = {
            userID: userData[0].id,
            username: userData[0].username,
            tournament: false,
            privileges: userData[0].privileges,
        }
        this.presence = {
            timezone: timezone,
            countryId: countryId,
            permissions: permissions,
            longitude: longitude,
            latitude: latitude,
        }
        this.status = {
            status: 0,
            statusText: '',
            beatmap: {
                beatmapChecksum: '',
                currentMods: 0,
                playMode: 0,
                beatmapId: 0,
            },
            rankedScore: 0,
            accuracy: 0,
            playCount: 0,
            totalScore: 0,
            rank: 0,
            performance: 0
        }
        this.token = uuid.v4();
        this.usingRelax = false;
       // this.usingAuto = false;
        this.announceRelax = false;
       // this.announceAP = false;
    }
    enqueue(buffer) {
        this.queue.push(buffer);
    }
}

module.exports = Player