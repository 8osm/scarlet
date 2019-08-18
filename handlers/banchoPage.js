function handle(req, res) {
    res.write("<pre>");
    res.write("                  by ilyt__     __   \n");
    res.write("   ______________ ______/ /__  / /_  \n");
    res.write("  / ___/ ___/ __ `/ ___/ / _ \\/ __/  \n");
    res.write(" (__  ) /__/ /_/ / /  / /  __/ /_    \n");
    res.write("/____/\\___/\\__,_/_/  /_/\\___/\\__/    \n");
    res.write("\n");;
    res.write("welcome to the Scarlet bancho implementation :d~\n");
    res.write("\n");
    res.write("home:   http://tojiru.pw \n");
    res.write("status: http://stat.tojiru.pw \n");
    res.write("boat:   https://discord.gg/2wTazST \n")
    res.write("online: " + global.players.length + " players");
    res.write("</pre>");
    res.end();
}

module.exports = handle;
