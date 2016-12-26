var System = require("pid-system");
var path = require("path");

function invokeLoad(mod) {
    var m = mod.module
    if (mod.module[0] === ".") {
        m = path.join(process.cwd(), m);
    }
    return [System.spawn(m, mod.function, mod.dictionary, views.dictionary), mod.linkTo || [], mod.bindTo || [], mod.register];
}

async function loadAll(config) {
    config = config || {};
    var modules = config.modules;
    var namespace = config.namespace;
    var linksTo = [];
    var bindsTo = [];

    for (var i in modules) {
        var [promisedPid, linkTo, bindTo, register] = invokeLoad(modules[i]);
        var pid = await promisedPid;

        if (register) {
            await System.register((namespace ? namespace : "") + register, pid);
        }

        linksTo.push([pid, linkTo])
        bindsTo.push([pid, bindTo])
    }

    return {
        linksTo: linksTo,
        bindsTo: bindsTo
    }
}

function shallowCopy(obj, o) {
    o = o || {};
    for (var i in obj) {
        o[i] = obj[i];
    }

    return o;
}

module.exports.loadAll = loadAll
