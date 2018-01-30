var Worker = require('webworker-threads').Worker;

const a = 6;
function runInThread(asyncFunction) {

    let worker = new Worker(() => {
        this.onmessage =  (e) => {
            console.log(JSON.stringify(e.data))
            const fn = new Function("return " + e.data[1])(e.data[2]);
            console.log(fn.toString())
            fn();
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



const getName = runInThread((username) => {
    console.log("callled..",username)
});

getName('developit')