// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

//var Amqp = require('azure-iot-device-amqp').Amqp;
// Uncomment one of these transports and then change it in fromConnectionString to test other transports
// var AmqpWs = require('azure-iot-device-amqp-ws').AmqpWs;
// var Http = require('azure-iot-device-http').Http;
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var crypto = require('crypto');


var generateSasToken = function(resourceUri, signingKey, policyName, expiresInMins) {
  resourceUri = encodeURIComponent(resourceUri.toLowerCase()).toLowerCase();

  // Set expiration in seconds
  var expires = (Date.now() / 1000) + expiresInMins * 60;
  expires = Math.ceil(expires);
  var toSign = resourceUri + '\n' + expires;

  // using crypto
  var decodedPassword = new Buffer(signingKey, 'base64').toString('binary');
  const hmac = crypto.createHmac('sha256', decodedPassword);
  hmac.update(toSign);
  var base64signature = hmac.digest('base64');
  var base64UriEncoded = encodeURIComponent(base64signature);

  // construct autorization string
  var token = "SharedAccessSignature sr=" + resourceUri + "&sig="
      + base64UriEncoded + "&se=" + expires;
  if (policyName) token += "&skn="+policyName;
  // console.log("signature:" + token);
  return token;
};

// String SharedAccessSignature in the following formats:
//  "SharedAccessSignature sr=<iothub_host_name>/devices/<device_id>&sig=<signature>&se=<expiry>"
var sas = generateSasToken('raspberry-pxl.azure-devices.net/devices/raspberry-pi', 'Y9cYHZGwQjeWG702yGaTDcB7sEkI8enE9vaD5tR8i34', 'device', 60);

// fromSharedAccessSignature must specify a transport constructor, coming from any transport package.
var client = Client.fromSharedAccessSignature(sas, Mqtt);

var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err);
  } else {
    console.log('Client connected');
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      client.complete(msg, printResultFor('completed'));
      // reject and abandon follow the same pattern.
      // /!\ reject and abandon are not available with MQTT
    });

    // Create a message and send it to the IoT Hub every second
    var sendInterval = setInterval(function () {
      var windSpeed = 10 + (Math.random() * 4); // range: [10, 14]
      var data = JSON.stringify({ deviceId: 'myFirstDevice', windSpeed: windSpeed });
      var message = new Message(data);
      message.properties.add('myproperty', 'myvalue');
      console.log('Sending message: ' + message.getData());
      client.sendEvent(message, printResultFor('send'));
    }, 2000);

    client.on('error', function (err) {
      console.error(err.message);
    });

    client.on('disconnect', function () {
      clearInterval(sendInterval);
      client.removeAllListeners();
      client.connect(connectCallback);
    });
  }
};

client.open(connectCallback);

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}
