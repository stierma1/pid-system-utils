var plsrFn = require("../lib/index").PLSR
var System = require("pid-system");
var Tokens = require("../lib/plsr/router/tokens");
var plsr = {
  promote: {
    modules:[
      {module:"./simple", function:"start", register: "start"},
      {module:"./simple", function:"one", register:"one"},
      {module:"./simple", function:"plusOne", register:"plusOne"},
      {module:"./simple", function:"log", register:"log"}
    ]
  },
  routes:{
    simple: [{name:"start", eventName:"data", preapply:function(data){
      return data;
    }}, {name:"one"},{name:"plusOne"}, {name:"log"}],
    simple2: [{name:"start", eventName:"data", preapply:function(data){
      return data;
    }}, {name:"one", condition:function(data){
      return Tokens.REDIRECT("simple");
    }}]
  }
}

plsrFn(plsr);

setTimeout(function(){
  System.resolve("start")
  .then(function(pid){
    pid.emit("data", [])
  })
}, 500)
