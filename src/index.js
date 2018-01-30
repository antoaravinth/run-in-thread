var Worker = require('webworker-threads').Worker;


function runInThread(asyncFunction) {

    const fn = () => {
        this.onmessage = (e) => {
            console.log(JSON.stringify(e));
            console.log("h");
            // console.log(userFn)

            /*
            Promise.resolve(e.data[1]).then(
                asyncFunction.apply.bind(asyncFunction, asyncFunction)
            ).then(
                d => {
                    postMessage([e.data[0], 0, d]);
                },
                e => {
                    postMessage([e.data[0], 1, ''+e]);
                }
            )*/

            self.close();
        }
    };

    let worker = new Worker(fn);

    worker.onmessage = e => {
      console.log(e)
      console.log(JSON.stringify(e));
    };

    return function(args) {
        args = [].slice.call(arguments);
        return new Promise(() => {
          worker.postMessage([0,args])
        })
    }
}



const getName = runInThread(async username => {
    console.log("callled..")
});

getName('developit')

/*
const asyncFn = () => {
    postMessage("I'm working before postMessage('ali').");
    this.onmessage = function(event) {
        postMessage('Hi ' + event.data);
        self.close();
    };
};

// You may also pass in a function:
var worker = new Worker(asyncFn);


worker.onmessage = function(event) {
    console.log("Worker said : " + event.data);
};
worker.postMessage('ali');
*/