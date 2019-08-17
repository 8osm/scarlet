function findClient (clientVersion, clientBuild) {
    // Unofficial clients & fallback
    if (clientBuild == 20161205 && clientVersion.includes ("cuttingedge")) 
        return "osufx"
    else if (clientVersion == 20181018 && clientVersion.includes ("noxna"))
        return "bananaclient"
    else if (clientVersion.includes ("banana"))
        return "bananaclient"
    else if (clientVersion.includes ("version"))
        return "tsuki"
    else if (clientBuild <20160403)
        return "fallback"
    
    // lazer check
    if (clientVersion.includes ("."))
        return "lazer"
    
    // Official clients
    if (clientVersion.includes ("beta"))
        return "osubeta"
    else if (clientVersion.includes ("cuttingedge"))
        return "cuttingedge"
    else if (clientVersion.includes ("tourney"))
        return "tournament"
    else if (clientVersion.includes ("dev"))
        return "dev"
    else if (clientVersion.includes ("public_test"))
        return "publictest"
    else if (clientVersion.includes ("noxna"))
        return "noxna"
    else
        return "stable"
}

module.exports = {
    findClient
};