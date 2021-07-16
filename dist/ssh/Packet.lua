--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____json = require("ssh.json")
local json = ____json.json
local PacketType = PacketType or ({})
PacketType.login = "login"
PacketType.disconnect = "disconnect"
PacketType.error = "error"
PacketType.keypress = "keypress"
PacketType.char = "char"
PacketType.inst_p = "inst_p"
PacketType.inst_o = "inst_o"
PacketType.inst_x = "inst_x"
PacketType.inst_c = "inst_c"
PacketType.inst_e = "inst_e"
PacketType.inst_H = "inst_H"
PacketType.inst_P = "inst_P"
PacketType.inst_U = "inst_U"
local Packet = __TS__Class()
Packet.name = "Packet"
function Packet.prototype.____constructor(self, ____type, payload)
    self.type = ____type
    self.payload = payload
end
function Packet.prototype.encode(self)
    local data = {t = self.type, p = self.payload}
    return json:stringify(data)
end
function Packet.parse(self, data)
    local parsed = json:parse(data)
    return __TS__New(Packet, parsed.t, parsed.p)
end
____exports.Packet = Packet
____exports.PacketType = PacketType
return ____exports
