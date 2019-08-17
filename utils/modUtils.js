const mods = ["NF", "EZ", "TD", "HD", "HR", "SD", "DT", "RX", "HT", "NC", "FL", "AU", "SO", "AP", "PF", "K4", "K5", "K6", "K7", "K8", "KM", "FI", "RD", "LM", "K9", "10", "K1", "K3", "K2", "V2"];

function stringifyMods(mods_enabled) {
  var ret = "";
  for (x in mods) {
    if (2**x & mods_enabled)
      ret += mods[x];
  }
  return ret;
}

function modsifyString(mod_string) {
  var ret = 0;
  for (x of mod_string.match(/../g))
    ret += 2 ** mods.indexOf(x);
  if (ret & 512)
    ret |= 64;
  return ret;
}

module.exports = {
    stringifyMods,
    modsifyString
}