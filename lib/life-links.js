var System = require("pid-system");

function lifeLinkTo(pid1, pid2){
  return System.Monitor(pid2, "_", function(state){
    if(pid1.state === "up"){
      System.exit(pid1, state || "normal");
    }
  });
}

function lifeBind(pid1, pid2){
  var mons = [];

  for(var i = 0; i < arguments.length - 1; i++){
    mons.push(lifeLinkTo(arguments[i], arguments[i+1]));
    mons.push(lifeLinkTo(arguments[i+1], arguments[i]));
  }

  return mons;
}

function messageLifeLinkTo(pid1, pid2, state, message){
  return System.Monitor(pid2, state || "_", function(){
    if(pid1.state === "up"){
      System.send(pid1, message);
    }
  });
}

module.exports.lifeLinkTo = lifeLinkTo;
module.exports.lifeBind = lifeBind;
module.exports.messageLifeLinkTo = messageLifeLinkTo;
