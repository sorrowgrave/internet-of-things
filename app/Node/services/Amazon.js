var awsIot = require('aws-iot-device-sdk');
var serialPort = require('../serialport/Serial.js');

    var myThingName = 'raspberrypi';

    var thingShadows = awsIot.thingShadow({
        keyPath: 'data/certs/bf3b0505a2-private.pem.key',
        certPath: 'data/certs/bf3b0505a2-certificate.pem.crt',
        caPath: 'data/certs/rootCA.pem',
        clientId: myThingName,
        region: 'eu-west-1'
    });

    mythingstate = {
        "state": {
            "reported": {
                "ip": "unknown"
            }
        }
    };

/*    var networkInterfaces = require( 'os' ).networkInterfaces( );

    mythingstate["state"]["reported"]["ip"] = networkInterfaces['eth0'][0]['address'];*/

/*    var i = 1;
    function myLoop () {           //  create a loop function
        setTimeout(function () {    //  call a 3s setTimeout when the loop is called
            thingShadows.publish('temp', i.toString());
            console.log(i + "");        //  your code here
            i++;                     //  increment the counter
            if (i < 1000) {            //  if the counter < 10, call the loop function
                myLoop();             //  ..  again which will trigger another
            }                        //  ..  setTimeout()
        }, 3000)
    }

    myLoop();*/


    thingShadows.on('connect', function() {
        console.log("Connected...");
        console.log("Registering...");
        thingShadows.register( myThingName, { persistentSubscribe: true } );
        //thingShadows.subscribe('topic_1');


        // An update right away causes a timeout error, so we wait about 2 seconds
        setTimeout( function() {
            console.log("Updating my IP address...");
            clientTokenIP = thingShadows.update(myThingName, mythingstate);
            console.log("Update:" + clientTokenIP);
        }, 2500 );

        // Code below just logs messages for info/debugging

        thingShadows.on('message',
            function(topic, payload) {
                console.log('message', topic, payload.toString());
            });

        thingShadows.on('status',
            function(thingName, stat, clientToken, stateObject) {
                console.log('received '+stat+' on '+thingName+': '+
                    JSON.stringify(stateObject));
            });

        thingShadows.on('update',
            function(thingName, stateObject) {
                console.log('received update '+' on '+thingName+': '+
                    JSON.stringify(stateObject));
            });

        thingShadows.on('delta',
            function(thingName, stateObject) {
                console.log('received delta '+' on '+thingName+': '+
                    JSON.stringify(stateObject));
            });

        thingShadows.on('timeout',
            function(thingName, clientToken) {
                console.log('received timeout for '+ clientToken)
            });

        thingShadows
            .on('close', function() {
                console.log('close');
            });
        thingShadows
            .on('reconnect', function() {thingShadows.register( myThingName, { persistentSubscribe: true } );
                console.log('reconnect');
            });
        thingShadows
            .on('offline', function() {
                console.log('offline');
            });
        thingShadows
            .on('error', function(error) {
                console.log('error', error);
            });

});



