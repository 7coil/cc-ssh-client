--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local logger = {
    log = function(____, ...) return print(...) end,
    error = function(____, ...)
        local existingColour = term.getTextColour()
        local existingBackground = term.getBackgroundColour()
        term.setTextColour(colours.red)
        term.setBackgroundColour(colours.black)
        print(...)
        term.setTextColour(existingColour)
        term.setBackgroundColour(existingBackground)
    end
}
____exports.logger = logger
return ____exports
