const request = require('request');

function getDatabyIP(ip) {
    return new Promise((resolve, reject) => {
        if(!ip)
            ip = "";
        request.get(global.config.localize.ipapi+ip, (err, res, b) => {
            try {
                if(err) reject(err);
                else if(b) resolve(JSON.parse(b));
            } catch(ex){
                reject(ex);
            }
        });
    });
}

module.exports = getDatabyIP;