var System = require("pid-system");
var path = require("path");

module.exports.null = async function(){
  await System.receive(this);
  return System.recurse(this, module.exports.null);
}

module.exports.spawn = function(diction, views){
  return System.spawn(path.join(__dirname, "null"), "null", diction, views)
}
