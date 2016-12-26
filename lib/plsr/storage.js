
var System = require("pid-system");

async function configStorageAll(config){
  config = config || {}
  var modules = config.modules;

  for(var i in modules){
    var mod = modules[i];
    var pid = await System.resolve(mod.register);
    pid.putValue("config", mod.config);
  }

}

module.exports.configStorageAll = configStorageAll;
