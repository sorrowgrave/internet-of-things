var awsIot = require('aws-iot-device-sdk');


var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var serialPort = new SerialPort("/dev/ttyACM0", {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
});

var myThingName = 'raspberrypi';

var thingShadows = awsIot.thingShadow({
   keyPath: '../certs/6d7321cf9f-private.pem.key',
  certPath: '../certs/6d7321cf9f-certificate.pem.crt',
    caPath: '../certs/rootCA.pem',
  clientId: myThingName,
    region: 'eu-west-1'
});

mythingstate = {
  "state": {
    "reported": {
      "ip": "unknown"
    }
  }
}

var networkInterfaces = require( 'os' ).networkInterfaces( );

mythingstate["state"]["reported"]["ip"] = networkInterfaces['enxb827eb564321'][0]['address'];


serialPort.on("open", function () {
    console.log('open');
    serialPort.on('data', function(data) {
        thingShadows.publish('topic_2', data);
        //console.log(data);
    });
});

thingShadows.on('connect', function() {
  console.log("Connected...");
  console.log("Registering...");
  thingShadows.register( myThingName, { persistentSubscribe: true } );
  thingShadows.subscribe('topic_1');



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



