// 1. Modules laden en gegevens ophalen
var express = require('express');
//var redis = require('redis');
//var client = redis.createClient();

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('socket.io-redis');

io.set("origins", "*:*");
io.adapter(redis({ host: 'localhost', port: 6379 }));

var bodyParser = require('body-parser');
var routes = require('./router/index');
var sockets = require('./socketio/sockets.js')(io);

// 2 .App instellen

// CORS toegangsrechten voor http requests
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Content-Length, Accept');
    res.header('Access-Control-Allow-Credentials', true);


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
server.listen(3000, function () {
    console.log('Express app gestart op localhost:3000');
});

