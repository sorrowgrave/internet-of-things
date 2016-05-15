/**
 * Created by Kenny on 11/05/2016.
 */

var childProcess = require('child_process');

var process;

var spawner = Spawner.prototype;

function Spawner(path){
    this.path = path;
}

spawner.runScript = function(callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    process = childProcess.fork(this.path);

    console.log("PID started" + process.pid);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

    // SIGTERM AND SIGINT will trigger the exit event.
    process.once("SIGTERM", function () {
        process.exit(0);
    });
    process.once("SIGINT", function () {
        process.exit(0);
    });
// And the exit event shuts down the child.
    process.once("exit", function () {
        //child.shutdown();
    });

};

spawner.stopScript = function(){
    // Get rid of the exit listener since this is a planned exit.
    //process.removeListener("exit", this.onUnexpectedExit);
    process.kill();
};

module.exports = Spawner;