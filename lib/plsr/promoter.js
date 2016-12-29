
var System = require("pid-system");


function invokePromote(mod, dMode, dDictionary, dViews){
  var dict = shallowCopy(mod.dictionary || {}, shallowCopy(dDictionary));
  var views = shallowCopy(mod.views || {}, shallowCopy(dViews));
  var m = mod.module

  return [System.promote(mod.function, mod.mode || dMode, dict, views), mod.linkTo || [], mod.bindTo || [], mod.register];
}

async function promoteAll(config){
  var modules = config.modules;
  var defaultMode = config.defaultMode;
  var defaultViews = config.defaultViews;
  var defaultDictionary = config.defaultDictionary;
  var linksTo = [];
  var bindsTo = [];

  for(var i in modules){
    var [promisedPid, linkTo, bindTo, register] = invokePromote(modules[i], defaultMode, defaultDictionary, defaultViews);
    var pid = await promisedPid;
    if(register){
      await System.register(register, pid);
    }

    linksTo.push([pid, linkTo])
    bindsTo.push([pid, bindTo])
  }

  return {
    linksTo:linksTo,
    bindsTo: bindsTo
  }
}

function shallowCopy(obj, o){
  o = o || {};
  for(var i in obj){
    o[i] = obj[i];
  }

  return o;
}

module.exports.promoteAll = promoteAll
