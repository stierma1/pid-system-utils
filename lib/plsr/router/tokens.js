var START = Symbol("START");
var CONTINUE = Symbol("CONTINUE");
var REDIRECT = Symbol("REDIRECT");
var DROP = Symbol("DROP");
var END = Symbol("END");

module.exports = {
  START: function(routeName){
    return {token:START, routeName:routeName};
  },
  CONTINUE: function(){
    return {token:CONTINUE}
  },
  REDIRECT: function(routeName){
    return {token:REDIRECT, routeName:routeName};
  },
  DROP: function(){
    return {token:DROP}
  },
  END:function(){
    return {token:END}
  },
  symbols: {
    START,
    CONTINUE,
    REDIRECT,
    DROP,
    END
  }
}
