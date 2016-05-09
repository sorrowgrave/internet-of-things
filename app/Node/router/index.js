/**
 * Created by Kenny on 4/05/2016.
 */

var router = require('express').Router();
var config = require('../data/settings.json');
var fs = require('fs');
var jsonfile = require('jsonfile');
var file = 'data/settings.json';

router.post('/gateway/modify/config/:spec', function (req, res, next) {

    console.log("Cloud settings put" );

    console.log(JSON.stringify(req.body ) + "data");

    var spec = req.params.spec;

    config.configuration[spec] = req.body;

    jsonfile.writeFileSync(file, config, {spaces: 4})

    //config.save(file);

    res.send(spec);

    next();


});

router.get('/gateway/get/config/:spec/:spec2*?', function (req, res, next) {

    var spec = req.params.spec;
    var spec2 = req.params.spec2;

    if(spec2 == null)
        var object = config.configuration[spec];
    else
        var object = config.configuration[spec][spec2];

    console.log(JSON.stringify(object));
    res.send(object);
});


module.exports = router;