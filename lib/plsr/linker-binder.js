var System = require("pid-system");
var lifeLinks = require("../life-links");

async function linkBindAll(config){
  var linksTo = config.linksTo;
  var bindsTo = config.bindsTo;

  for(var i in linksTo){
    var [pid, links] = linksTo[i];
    for(var j in links){
      var pid2 = await System.resolve(links[j]);
      lifeLinkTo(pid, pid2);
    }
  }

  for(var i in bindsTo){
    var [pid, binds] = bindsTo[i];
    for(var j in binds){
      var pid2 = await System.resolve(binds[j]);
      lifeBind(pid, pid2);
    }
  }
}


module.exports.linkBindAll = linkBindAll;
