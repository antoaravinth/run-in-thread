var Worker = require('webworker-threads').Worker;

function runInThread(asyncFunction) {

    let worker = new Worker(() => {
        this.onmessage =  (e) => {
            console.log(JSON.stringify(e.data[2]))
            const fn = new Function("return " + e.data[1])();
            console.log(fn.toString())
            fn("anto","aravinth");
            self.close();
        }

        this.onerror = (e) => {
            console.log(e)
        }
    });


    worker.onmessage = e => {
      console.log(JSON.stringify(e));
    };

    return function(args) {
        args = [].slice.call(arguments);
        return new Promise(() => {
          const code = Function.prototype.toString.call(asyncFunction);
          worker.postMessage([0,code,args])
        })
    }
}



const getName = runInThread(async (username,test) => {
    console.log("callled..",username,test)
});

getName('developit')