var System = require("pid-system")
var RoutingInstance = require("./routing-instance");
var RoutingMessage = require("./routing-message");
var Tokens = require("./tokens");
var LifeLink = require("../../life-links");

async function routeMaster(){
  if(!this.getValue("initialized")){

    await initialize.call(this, this.getValue("config"));
    return;
  }

  var [token, ...rest] = arguments;
  switch(token.token){
    case Tokens.symbols.START:
      var rI = await System.promote(RoutingInstance, "emitter", {path:this.getValue("routes")[token.routeName], routingMaster:this.getValue("name")});
      System.send(rI, [new RoutingMessage(token.routeName, rest, false)]);
      break;
    case Tokens.symbols.REDIRECT:
      System.exit(rest[0], "normal", "Redirected to " +  token.routeName);
      var rI = await System.promote(RoutingInstance, "emitter", {path:this.getValue("routes")[token.routeName],  routingMaster:this.getValue("name")});
      rest[1].update(token.routeName, rest[1].data);
      System.send(rI, [rest[1]]);
      break;
    case Tokens.symbols.END:
      System.exit(rest[0], "normal", "Ended");
      break;
    case Tokens.symbols.DROP:
      System.exit(rest[0], "normal", "Dropped");
      break;
    default: break;
  }
}

async function initialize(config){
  this.putValue("routes", config);

  for(var i in config){
    var routeName = config[i];
    var routeStartPid = await System.resolve(routeName[0].name);
    routeStartPid.on(routeName[0].eventName, subscribe(routeStartPid, this, i));
  }

  this.putValue("initialized", true);

}

function subscribe(senderPid, recPid, route){
  return function(){

    var args = [Tokens.START(route)];
    for(var i = 0; i < arguments.length; i++){
      args.push(arguments[i]);
    }
    System.send.apply(senderPid, [recPid, args]);
  }
}

module.exports = routeMaster;
