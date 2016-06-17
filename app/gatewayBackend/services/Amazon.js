'use strict';

var awsIot = require('aws-iot-device-sdk');
var config = require('../data/settings.json').configuration.gateway.amazon;

var myThingName = config.thingName;

var thingShadows = awsIot.thingShadow({
    keyPath: config.keyPath,
    certPath: config.certPath,
    caPath: config.caPath,
    clientId: myThingName,
    region: config.region
});

var mythingstate = {
    "state": {
        "reported": {
            "ip": "unknown"
        }
    }
};

var serialPort = require('../serialio/Serial.js')('amazon', thingShadows);


thingShadows.on('connect', function () {
    console.log("Connected...");
    console.log("Registering...");
    thingShadows.register(myThingName, {persistentSubscribe: true});
    //thingShadows.subscribe('topic_1');


    // An update right away causes a timeout error, so we wait about 2 seconds
    setTimeout(function () {
        console.log("Updating my IP address...");
        var clientTokenIP = thingShadows.update(myThingName, mythingstate);
        console.log("Update:" + clientTokenIP);
    }, 2500);

    // Code below just logs messages for info/debugging

    thingShadows.on('message',
        function (topic, payload) {
            console.log('message', topic, payload.toString());
        });

    thingShadows.on('status',
        function (thingName, stat, clientToken, stateObject) {
            console.log('received ' + stat + ' on ' + thingName + ': ' +
                JSON.stringify(stateObject));
        });

    thingShadows.on('update',
        function (thingName, stateObject) {
            console.log('received update ' + ' on ' + thingName + ': ' +
                JSON.stringify(stateObject));
        });

    thingShadows.on('delta',
        function (thingName, stateObject) {
            console.log('received delta ' + ' on ' + thingName + ': ' +
                JSON.stringify(stateObject));
        });

    thingShadows.on('timeout',
        function (thingName, clientToken) {
            console.log('received timeout for ' + clientToken)
        });

    thingShadows
        .on('close', function () {
            console.log('close');
        });
    thingShadows
        .on('reconnect', function () {
            thingShadows.register(myThingName, {persistentSubscribe: true});
            console.log('reconnect');
        });
    thingShadows
        .on('offline', function () {
            console.log('offline');
        });
    thingShadows
        .on('error', function (error) {
            console.log('error', error);
        });
});



