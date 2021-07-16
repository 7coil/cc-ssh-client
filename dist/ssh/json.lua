--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local json = {
    parse = function(self, contents)
        local parsed = textutils.unserializeJSON(contents)
        return parsed
    end,
    stringify = function(self, contents)
        return textutils.serializeJSON(contents)
    end
}
____exports.json = json
return ____exports
