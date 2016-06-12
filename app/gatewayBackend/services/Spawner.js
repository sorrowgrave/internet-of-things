/**
 * Created by Kenny on 11/05/2016.
 */

var childProcess = require('child_process');

var process;

var spawner = Spawner.prototype;

function Spawner(path){

    this.path = path;
    this.running = false
}

spawner.runScript = function(callback) {


    // controleer of de callback eerder werd getriggerd
    var invoked = false;

    if(!this.running)
    {
        process = childProcess.fork(this.path);
        console.log("PID started" + process.pid);
        this.running = true;
    }
    else
        return;

    // luister naar errors die het exit event kunnen omzeilen
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // voer de callback uit eenmaal het exit event is getriggerd
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

    // SIGTERM en SIGINT triggeren het exit event
    process.once("SIGTERM", function () {
        console.log("SIGTERM");
        process.exit(0);
    });
    process.once("SIGINT", function () {
        console.log("SIGINT");
        process.exit(0);
    });

};

spawner.stopScript = function(){

    if(this.running)
        process.kill(-childProcess.pid, 'SIGTERM');

    this.running = false;
};

module.exports = Spawner;