const { query } = require("../common/db"),
    log = require("../common/log");

class Channel {
    constructor(name, description, publicRead, publicWrite, temp, hidden) {
        this.name = name;
        this.description = description;
        this.publicRead = publicRead;
        this.publicWrite = publicWrite;
        this.moderated = false;
        this.temp = temp;
        this.hidden = hidden;
        this.joinedPlayers = [999];
    }
}



async function createChannels() {
    let q = await query("SELECT * FROM bancho_channels");
    q.forEach(channel => { 
        let c = new Channel(channel.name, channel.description, channel.public_read, channel.public_write, channel.temp, channel.hidden)
        global.channels.push(c);
        log.info("Created channel " + channel.name, undefined, false, true);
    });
    return
}

module.exports = {
    Channel,
    createChannels
}