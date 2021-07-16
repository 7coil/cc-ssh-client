--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____logger = require("ssh.logger")
local logger = ____logger.logger
local ____Packet = require("ssh.Packet")
local Packet = ____Packet.Packet
local PacketType = ____Packet.PacketType
local ____packetHandler = require("ssh.packetHandler")
local packetHandler = ____packetHandler.default
local ____parsearg = require("ssh.parsearg")
local parsearg = ____parsearg.parsearg
local programRunning
local function exit(____, code)
    programRunning = false
end
os.exit = exit
local initialTerminalWidth, initialTerminalHeight = term.getSize()
programRunning = true
local argv = {...}
local options = parsearg(nil, argv)
if programRunning then
    local websocket, errorMessage = http.websocket(options.websocket)
    term.setCursorBlink(true)
    if websocket then
        local loginPacket = __TS__New(Packet, PacketType.login, {width = initialTerminalWidth, height = initialTerminalHeight, remote = options.destination, username = options.username})
        websocket.send(
            loginPacket:encode()
        )
        local ctrl = false
        while programRunning do
            local e = {
                os.pullEvent()
            }
            local event = unpack(e)
            if event == "websocket_message" then
                local ____, url, message = unpack(e)
                if url == options.websocket then
                    local packet = Packet:parse(message)
                    packetHandler:handlePacket(packet)
                end
            elseif event == "key" then
                local ____, keycode, held = unpack(e)
                if keycode == 341 then
                    ctrl = true
                elseif (keycode >= 64) and (keycode <= 95) then
                    if ctrl then
                        local packet = __TS__New(
                            Packet,
                            PacketType.char,
                            {
                                char = string.char(keycode - 64)
                            }
                        )
                        websocket.send(
                            packet:encode()
                        )
                    end
                else
                    local packet = __TS__New(Packet, PacketType.keypress, {kc = keycode, held = held})
                    websocket.send(
                        packet:encode()
                    )
                end
            elseif event == "key_up" then
                local ____, keycode = unpack(e)
                if keycode == 341 then
                    ctrl = false
                end
            elseif event == "char" then
                local ____, char = unpack(e)
                local packet = __TS__New(Packet, PacketType.char, {char = char})
                websocket.send(
                    packet:encode()
                )
            end
        end
    else
        logger:error(
            ("WebSockets: " .. tostring(errorMessage)) or "Unknown error."
        )
    end
end
term.setCursorBlink(false)
return ____exports
