const { query } = require("../common/db");

async function createConfig() {
    let cfg = await query("SELECT * FROM bancho_settings");
    global.banchoConfig = cfg;
    return
}

function findValue(name) {
    for (let i = 0; i < global.banchoConfig.length; i++) {
        if (global.banchoConfig[i].name == name) {
            return global.banchoConfig[i];
        }
    }
        
    
}

module.exports = {
    createConfig,
    findValue
};