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


router.post('/gateway/modify/config/:spec', function (req, res, next) {

    console.log("Cloud settings put" );

    console.log(JSON.stringify(req.body ) + "data");

    var spec = req.params.spec;

    config.configuration[spec] = req.body;

    jsonfile.writeFileSync(file, config, {spaces: 4})

    //config.save(file);

    res.send(spec);

    //next();

});

router.get('/gateway/get/config/:spec/:spec2*?', function (req, res, next) {

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


router.get('/gateway/start/script/amazon', function (req, res, next) {
// executes `pwd`

    var cloud = req.params.cloud;


// Now we can run a script and invoke a callback when complete, e.g.

    amazonSpawner.runScript(function (err) {
        console.log('finished running some-script.js');
    });
/*
    amazon.start();*/
    res.send("app started");

});

router.get('/gateway/stop/script/amazon', function (req, res, next) {
// executes `pwd`

    amazonSpawner.stopScript();

    res.send("app stopped");

});

router.get('/gateway/script/status/amazon', function (req, res, next) {
// executes `pwd`

    res.send(amazon.status());

});


module.exports = router;