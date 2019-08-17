const { query } = require("../common/db");

async function handle() {
    let cfg = await query("SELECT * FROM bancho_settings");
    global.banchoConfig = cfg;
    return
}

module.exports = handle;