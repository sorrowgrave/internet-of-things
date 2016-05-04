/**
 * Created by Kenny on 4/05/2016.
 */
// Uitwerking film toevoegen via een formulier op de website

var router = require('express').Router();
var config = require('../data/settings.json');

// Een POST-request verwerken om nieuwe film toe te voegen
router.post('/gateway/add/settings', function (req, res) {

    // verwerk binnenkomende request. We gaan er van uit
    // dat de parameters 'Titel', 'Auteur' en 'Jaar' aanwezig zijn.


    // dynamisch nieuwe ID uitrekenen en film-object samenstellen.

    // push naar de array

    // Echo de nieuwe films naar de client zodat ze verwerkt kunnen worden.

    var newFilm = {};
    newFilm.id = films.length + 1;
    newFilm.titel = req.body.titel;
    newFilm.auteur = req.body.auteur;
    newFilm.jaar = req.body.jaar;

    config.push(newFilm);

    res.send(films);

});

// Retourneer films
router.get('/gateway/get/config/:spec', function (req, res, next) {

    var spec = req.params.spec;

    var object = config.configuration[spec];

    //var test = JSON.parse(films);
    console.log(object);
    res.json(object);
});

// 4. DELETE-endpoint: boek verwijderen uit het JSON object.
router.delete('/gateway/deletefilm/:id', function (req, res, next) {
    var id = req.params.id;

    films.splice(id-1, 1);

    res.send(films);

    next();

});

module.exports = router;