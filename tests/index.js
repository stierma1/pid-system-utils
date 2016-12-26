var System = require("pid-system");
var LifeLink = require("../lib/life-links");

(async function(){

var p1 = await System.promote(function(){
  return 1;
})

var p2 = await System.promote(function(){
  return 2;
})

LifeLink.lifeBind(p1, p2);
console.log(p2.state)
await System.exit(p1);
console.log(p2.state)

})()
