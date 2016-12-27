
class RoutingMessage{
  constructor(initRoute,initData, keepHistory){
    this.data = initData;
    this.route = initRoute;
    this.currentIndex = 0;
    this.sequenceIdx = 0;
    this.keepHistory = keepHistory;
    this.routeHistory = [];
    if(keepHistory){
      this.routeHistory = [{route: initRoute, sequence:0}];
    }

  }

  update(route,data){
    this.data = data;
    this.sequenceIdx = route === this.route ? this.sequenceIdx + 1 : 0;
    this.route = route;
    this.currentIndex++;
    if(this.keepHistory){
      this.routeHistory.push({route: route, sequence:this.sequenceIdx})
    }
    return this;
  }

  clone(){
    var rM = new RoutingMessage(this.route, this.data, this.keepHistory);
    rM.sequenceIdx = this.sequenceIdx;
    rM.currentIndex = this.currentIndex;
    rM.routeHistory = this.routeHistory.map(function(x){return x});
    return rM;
  }
}


module.exports = RoutingMessage;
