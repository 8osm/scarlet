function findChannelByName(name) {
    if (name.length == 0) { return null; }
    if (!name.startsWith("#")) {
        name = "#" + name;
    }
    let c = null;
    global.channels.forEach(chan => {
        if (chan.name.toLowerCase() == name.toLowerCase()) {
            c = chan;
        }
    })
    return c;
}


module.exports = {
    findChannelByName
}