const Worker = require('webworker-threads').Worker;

function runInThread(asyncFunction) {

    let worker = new Worker(() => {

        this.onmessage =  (e) => {
            const fn = new Function("return " + e.data[1])();
            Promise.resolve(e.data[2]).then(
                fn.apply.bind(fn,...e.data[2])
            ).then(
                d => {
                    postMessage([e.data[0], 0, d]);
                    self.close();
                },
                er => {
                    postMessage([e.data[0],1,er]);
                    self.close();
                }
            );
        };

        this.onerror = (e) => {
            self.close();
        };

    });

    let promises = {} , currentId = 0;

    worker.onmessage = e => {
      promises[e.data[0]][e.data[1]](e.data[2]);
      promises[e.data[0]] = null;
    };

    return function(args) {
        args = [].slice.call(arguments);
        return new Promise(function() {
          promises[++currentId] = arguments;
          const code = Function.prototype.toString.call(asyncFunction);
          worker.postMessage([currentId,code,args])
        })
    }
}



const getName = runInThread((fetch) => {
    console.log("answer is",fetch)
    return "anto aravinth"
});


getName("anto").then((data) => {
    console.log(data)
});
