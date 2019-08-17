const http = require("http"),
    log = require("./common/log"),
    { query } = require("./common/db"),
    osuToken = require("./objects/player");

let app = http.createServer();
global.players = [];
global.channels = [];
global.banchoConfig = undefined;

app.on("request", (req, res) => {
    // On request, get headers and method
    const { headers, method } = req;
    req.on("data", (data) => {
        if (method == "POST") {
            let osuToken = headers["osu-token"];
            if (!osuToken) {
                require("./events/loginEvent")(req, res, data, headers);
            } else {
                require("./handlers/mainHandler")(res, data, osuToken);
            }
        } else {
            res.end("hi")
        }
    })
})

app.listen(5001, async () => {
    log.info("Bancho has started successfully");
    log.info("Logging in bot");
    let botData = await query("SELECT * FROM users WHERE id = 999");
    let bot = new osuToken(botData, 0, require("./utils/countryUtils").getCountryID("A2"), 0, 0);
    global.players.push(bot);
    require("./objects/channel").createChannels()
})