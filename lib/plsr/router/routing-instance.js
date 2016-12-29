var System = require("pid-system");
var Tokens = require("./tokens");

async function routingInstance(message){

  var path = this.getValue("path");
  var currentNode = path[message.sequenceIdx];
  var nextNode = path[message.sequenceIdx + 1];
  var nextAction = Tokens.CONTINUE();

  if(currentNode.condition){
    nextAction = currentNode.condition(message.data) || Tokens.CONTINUE();
  }
  if(nextAction.token === Tokens.symbols.CONTINUE && nextNode === undefined) {
    nextAction = Tokens.END()
  } else if(nextAction.token === Tokens.symbols.CONTINUE && nextNode.fork){

    for(var i = 0; i < message.data.length - 1; i++){
      var mes = message.clone();
      mes.update(message.route, message.data[i]);
      var pid = await System.promote(routingInstance, "emitter", {path:path});
      System.send(pid, [mes]);
    }

    message.update(message.route, message.data[message.data.length - 1]);
    return System.send(this, [message]);
  }

  if(nextAction.token === Tokens.symbols.CONTINUE){
    var sendData = message.data;
    if(nextNode.preapply){
      sendData = nextNode.preapply(sendData);
    }

    var pid = await System.resolve(nextNode.name);
    System.send(pid, [this, sendData]);

    var returnData = await System.receive(this);
    if(nextNode.postApply){
      returnData = nextNode.postApply(returnData);
    }
    message.update(message.route, returnData);
    System.send(this, [message]);
  } else {
    var rM = await System.resolve(this.getValue("routingMaster"));
    System.send(rM, [nextAction, this, message]);
  }
}

module.exports = routingInstance;
