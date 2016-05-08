/**
 * Created by Kenny on 4/05/2016.
 */

var router = require('express').Router();
var config = require('../data/settings.json');
var fs = require('fs');
var jsonfile = require('jsonfile');
var file = 'data/settings.json';

// Een POST-request verwerken om nieuwe film toe te voegen
/*router.post('/gateway/modify/config/cloud', function (req, res, next) {

    //var spec = req.params.spec;

    console.log("Cloud settings posted");


    config.configuration.cloud.amazon.endPoint = req.body.endPoint;


    res.send(config);

    next();

});*/

router.post('/gateway/modify/config/:spec', function (req, res) {

    console.log("Cloud settings put" );

    console.log(JSON.stringify(req.body ) + "data");

    var spec = req.params.spec;

    config.configuration[spec] = req.body;
    //fs.writeFileSync('data/settings.json', JSON.stringify(req.body));

/*
    jsonfile.writeFile(file, config, function (err) {
        console.error(err)
    })
*/

    jsonfile.writeFileSync(file, config, {spaces: 4})

    //config.save(file);

    res.send(spec);


});

router.get('/gateway/get/config/:spec', function (req, res, next) {

    var spec = req.params.spec;

    var object = config.configuration[spec];

    //var test = JSON.parse(films);
    console.log(object);
    res.send(object);
});

router.delete('/gateway/deletefilm/:id', function (req, res, next) {
    var id = req.params.id;

    films.splice(id-1, 1);

    res.send(films);

    next();

});

module.exports = router;