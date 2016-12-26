
class RoutingMessage{
  constructor(initRoute,initData, keepHistory){
    this.data = initData;
    this.route = initRoute;
    this.currentIndex = 0;
    this.sequenceIdx = 0;
    this.keepHistory = keepHistory;

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
}


module.exports = RoutingMessage;
