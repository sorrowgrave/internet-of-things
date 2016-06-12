/**
 * Created by Kenny on 4/05/2016.
 */

var router = require('express').Router();
var config = require('../data/settings.json');
var fs = require('fs');
var jsonfile = require('jsonfile');
var file = 'data/settings.json';
var Spawner = require('../services/Spawner.js');

var amazonSpawner = new Spawner('services/Amazon.js');
var azureSpawner = new Spawner('services/Azure.js');

var io = require('socket.io-emitter')({ host: 'localhost', port: 6379 });


router.post('/gateway/modify/config/:spec', function (req, res) {

    console.log("Cloud settings posted" );

    console.log(JSON.stringify(req.body ) + "data");

    var spec = req.params.spec;

    config.configuration[spec] = req.body;

    jsonfile.writeFileSync(file, config, {spaces: 4});

    res.send(spec);
});

router.get('/gateway/get/config/:spec/:spec2*?', function (req, res) {

    var spec = req.params.spec;
    var spec2 = req.params.spec2;
    var object;

    if(spec2 == null)
        object = config.configuration[spec];
    else
        object = config.configuration[spec][spec2];

    console.log(JSON.stringify(object));
    res.send(object);
});


router.get('/gateway/invoke/script/amazon', function (req, res) {

    if(!amazonSpawner.running)
    {
        amazonSpawner.runScript(function (err) {
            console.log('Finished running Amazon.js with ' + err);
            amazonSpawner.running = false;
        });
    }
    else
    {
        amazonSpawner.stopScript();
    }

    io.emit('amazon:scriptstatus', amazonSpawner.running ? {status: "Off"} : {status: "On"});
    res.send(amazonSpawner.running);

});


router.get('/gateway/invoke/script/azure', function (req, res) {

    if(!azureSpawner.running)
    {
        azureSpawner.runScript(function (err) {
            console.log('Finished running Azure.js with ' + err);
            azureSpawner.running = false;
        });
    }
    else
    {
        azureSpawner.stopScript();
    }

    io.emit('azure:scriptstatus', azureSpawner.running ? "Off" : "On");
    res.send(azureSpawner.running);

});

module.exports = router;