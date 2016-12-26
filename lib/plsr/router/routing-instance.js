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
    var rM = await System.resolve("routing-master");
    System.send(rM, [nextAction, this, message]);
  }
}

module.exports = routingInstance;
