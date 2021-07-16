--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local colourMapping = {{1, nil, 1}, {39, nil, 1}, {nil, 1, 32768}, {nil, 49, 32768}, {30, 40, 32768}, {31, 41, 64}, {32, 42, 8192}, {33, 43, 2}, {34, 44, 8}, {35, 45, 1024}, {36, 46, 512}, {37, 47, 1}, {90, 100, 128}, {91, 101, 16384}, {92, 102, 32}, {93, 103, 16}, {94, 104, 2048}, {95, 105, 4}}
local function findForeground(____, ansi)
    local found = __TS__ArrayFind(
        colourMapping,
        function(____, ____bindingPattern0)
            local foreground
            foreground = ____bindingPattern0[1]
            local background = ____bindingPattern0[2]
            local computercraft = ____bindingPattern0[3]
            return foreground == ansi
        end
    )
    if found then
        return found[3] or nil
    end
    return nil
end
local function findBackground(____, ansi)
    local found = __TS__ArrayFind(
        colourMapping,
        function(____, ____bindingPattern0)
            local foreground = ____bindingPattern0[1]
            local background
            background = ____bindingPattern0[2]
            local computercraft = ____bindingPattern0[3]
            return background == ansi
        end
    )
    if found then
        return found[3] or nil
    end
    return nil
end
____exports.findBackground = findBackground
____exports.findForeground = findForeground
return ____exports
