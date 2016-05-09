// 1. Modules laden en gegevens ophalen
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./router/index');

// 2 .App instellen
var app = express();


// CORS toegangsrechten voor http requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Length, Accept");
    //res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

// 3. Middleware laden voor het parsen van JSON in het request
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// 4. Stel middleware in voor serveren van statische bestanden (HTML, CSS, images)
app.use(express.static(__dirname + '/public'));

// 5. Gebruik de Routes in ingesloten bestand
app.use('/', routes);

// 6. Start de server.
app.listen(3000, function () {
    console.log('Express app gestart op localhost:3000');
});
