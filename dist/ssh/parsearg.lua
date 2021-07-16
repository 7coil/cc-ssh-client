--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____argparse = require("ssh.argparse")
local Argparse = ____argparse.default
local RECOGNISED_HELP_FLAGS = {"--help", "-h", "-?"}
local function parsearg(____, argv)
    local initialTerminalWidth, initialTerminalHeight = term.getSize()
    local parser = ____argparse()
    parser:usage_max_width(initialTerminalWidth)
    parser:help_description_margin(11)
    parser:help_usage_margin(0)
    parser:argument("destination"):description("Hostname/IP")
    parser:option("-p --websocket"):description("ComputerCraft SSH websocket proxy server"):default("ws://127.0.0.1:8080")
    parser:option("-u --username"):description("Username of the connection")
    parser:flag("-v"):description("Display all lua 'argparse' arguments")
    local parsed = parser:parse(argv)
    local username, destination = unpack(
        __TS__StringSplit(parsed.destination, "@")
    )
    if username and destination then
        parsed.username = username
        parsed.destination = destination
    end
    if parsed.verbose then
        __TS__ArrayForEach(
            __TS__ObjectEntries(parsed),
            function(____, ____bindingPattern0)
                local k
                k = ____bindingPattern0[1]
                local v
                v = ____bindingPattern0[2]
                return print(
                    (k .. " - ") .. tostring(v)
                )
            end
        )
    end
    return parsed
end
____exports.parsearg = parsearg
return ____exports
