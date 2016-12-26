var System = require("pid-system");
var path = require("path");

module.exports.topic = function(){
  var message = await System.receive(this);
  var pids = this.getValue("pids");
  for(var i in pids){
    System.send(pids[i], message);
  }
  return System.recurse(this, module.exports.topic);
}

module.exports.spawn = function(pids, diction, views){
  var d = shallowCopy(diction);
  d.pids = pids;
  return System.spawn(path.join(__dirname, "topic"), "topic", d, views);
}

module.exports.subscribe = function(pid, topicPid){
  var pids = topicPid.getValue("pids") || [];
  pids.push(pid);
  topicPid.putValue("pids", pids);
}



function shallowCopy(obj, o){
  o = o || {};
  for(var i in obj){
    o[i] = obj[i];
  }

  return o;
}
