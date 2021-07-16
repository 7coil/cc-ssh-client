--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____Packet = require("ssh.Packet")
local PacketType = ____Packet.PacketType
local terminalPacketHandler = {
    TERMINAL_PACKET_TYPES = TERMINAL_PACKET_TYPES,
    handlePacket = function(self, packet)
        if packet.type == PacketType.inst_p then
            self:inst_p(packet)
        end
        if packet.type == PacketType.inst_o then
            self:inst_o(packet)
        end
        if packet.type == PacketType.inst_x then
            self:inst_x(packet)
        end
        if packet.type == PacketType.inst_c then
            self:inst_c(packet)
        end
        if packet.type == PacketType.inst_e then
            self:inst_e(packet)
        end
        if packet.type == PacketType.inst_H then
            self:inst_H(packet)
        end
        if packet.type == PacketType.inst_P then
            self:inst_P(packet)
        end
        if packet.type == PacketType.inst_U then
            self:inst_U(packet)
        end
    end,
    inst_p = function(self, packet)
        local terminalInstpPacket = packet
        term.write(terminalInstpPacket.payload.s)
    end,
    inst_o = function(self, packet)
    end,
    inst_x = function(self, packet)
        local terminalInstxPacket = packet
        local ____ = terminalInstxPacket.payload
        local flag = ____.flag
        local x, y = term.getCursorPos()
        if flag == "\n" then
            print()
        elseif flag == "\r" then
            term.setCursorPos(1, y)
        elseif flag == "\b" then
            local width, height = term.getSize()
            if x == 0 then
                term.setCursorPos(width - 1, y - 1)
            else
                term.setCursorPos(x - 1, y)
            end
        elseif flag == "" then
            local speaker = peripheral.find("speaker")
            speaker.playSound("minecraft:entity.player.levelup")
        end
    end,
    inst_c = function(self, packet)
        local terminalInstcPacket = packet
        local ____ = terminalInstcPacket.payload
        local flag = ____.flag
        local params = ____.params
        if flag == "K" then
            local param = unpack(params)
            local x, y = term.getCursorPos()
            local width, height = term.getSize()
            if param == 0 then
                do
                    local i = x
                    while i < width do
                        term.setCursorPos(i, y)
                        term.write(" ")
                        i = i + 1
                    end
                end
                term.setCursorPos(x, y)
            elseif param == 1 then
                do
                    local i = 0
                    while i <= x do
                        term.setCursorPos(i, y)
                        term.write(" ")
                        i = i + 1
                    end
                end
                term.setCursorPos(x, y)
            elseif param == 2 then
                term.clearLine()
            else
                term.clearLine()
            end
        elseif flag == "H" then
            local x, y = unpack(params)
            if y then
                term.setCursorPos(y, x)
            else
                term.setCursorPos(1, 1)
            end
        elseif flag == "J" then
            local param = unpack(params)
            if param == 2 then
                term.clear()
            end
        elseif (((flag == "A") or (flag == "B")) or (flag == "C")) or (flag == "D") then
            local x, y = term.getCursorPos()
            local amount = unpack(params)
            if flag == "A" then
                y = y - amount
            end
            if flag == "B" then
                y = y + amount
            end
            if flag == "C" then
                x = x + amount
            end
            if flag == "D" then
                x = x - amount
            end
            term.setCursorPos(x, y)
        end
    end,
    inst_e = function(self, packet)
    end,
    inst_H = function(self, packet)
    end,
    inst_P = function(self, packet)
    end,
    inst_U = function(self, packet)
    end
}
____exports.default = terminalPacketHandler
return ____exports
