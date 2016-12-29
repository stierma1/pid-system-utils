console.log()
var plsrFn = require("../lib/index").PLSR
var System = require("pid-system");
var Tokens = require("../lib/plsr/router/tokens");
var plsr = {
    promote: {
        modules: [{
            function: require("./simple").start,
            register: "start"
        }, {
            function: require("./simple").one,
            register: "one"
        }, {
            function: require("./simple").plusOne,
            register: "plusOne"
        }, {
            function: require("./simple").log,
            register: "log"
        }]
    },
    router: {
        name: "router-master2",
        routes: {
            simple: [{
                name: "start",
                eventName: "data",
                preapply: function(data) {
                    return data;
                }
            }, {
                name: "one"
            }, {
                fork: true
            }, {
                name: "one",
                condition: function(d) {
                    return Tokens.CONTINUE()
                }
            }, {
                name: "plusOne"
            }, {
                name: "log"
            }],
            simple2: [{
                name: "start",
                eventName: "data",
                preapply: function(data) {
                    return data;
                }
            }, {
                name: "one",
                condition: function(data) {
                    return Tokens.REDIRECT("simple");
                }
            }]
        }
    }
}

plsrFn(plsr);

setTimeout(function() {
    System.resolve("start")
        .then(function(pid) {
            pid.emit("data", [])
        })
}, 500)
