function start(){

}

function one(){
  return 1
}

function plusOne(x){
  return x + 1;
}

function log(message){
  console.log(message);
  return true;
}

module.exports.one = one;
module.exports.plusOne = plusOne;
module.exports.log = log;
module.exports.start = start;
