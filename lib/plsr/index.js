var System = require("pid-system");
var RoutingMaster = require("./router/routing-master");
var Promoter = require("./promoter");
var LinkerBinder = require("./linker-binder");
var Loader = require("./loader");
var Storage = require("./storage");

module.exports = async function(config){
  var pid = await System.promote(RoutingMaster, "emitter", {config: config.routes});
  await System.register("routing-master", pid);
  var {linksTo, bindsTo} = await Promoter.promoteAll(config.promote);
  var links2 = linksTo;
  var binds2 = bindsTo;
  var {linksTo, bindsTo} = await Loader.loadAll(config.load);
  LinkerBinder.linkBindAll({linksTo: linksTo.concat(links2), bindsTo: bindsTo.concat(binds2)});
  Storage.configStorageAll(config.storage);
  var pid = await System.resolve("routing-master");
  System.send(pid, [{}])
}

module.exports.TOKENS = require("./router/tokens");

/*{

  promote: {
    defaultMode: "receive-in-message",
    defaultDictionary:{

    },
    defaultViews: {

    },
    modules:[{module:"", function:"", register:"", linkTo:[""], bindTo:[""]]
  },
  load: {
    namespace: "",
    modules: [
      {module:"", function:"", staticParams:[], register:"", views:{}, dictionary:{}}
    ]
  },
  storage: {
    modules:[
      {register:"", type:"", config:{}}
    ]
  },
  route: {
    routeName: [
      {name: "", eventName:""},
      {name: "", cond:function(){
        return this.continue()
      }}
    ]
  }

}*/
