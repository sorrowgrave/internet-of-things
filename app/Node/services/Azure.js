/**
 * Created by Kenny on 29/04/2016.
 */

'use strict';

var AMQPClient = require('amqp10').Client;
var Policy = require('amqp10').Policy;
var translator = require('amqp10').translator;
var Promise = require('bluebird');

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var crypto = require('crypto');

var protocol = 'amqps';
var eventHubHost = 'ihsuprodamres015dednamespace.servicebus.windows.net/';
var sasName = 'iothubowner';
var sasKey = 'qsrJ7NU3y0BWLfT9bh2CQPseIU9qrko/woj8k+eTeks=';
var eventHubName = 'iothub-ehub-raspberry-33653-472e0fb3b7';
var numPartitions = 2;

var uri = protocol + '://' + encodeURIComponent(sasName) + ':' + encodeURIComponent(sasKey) + '@' + eventHubHost;
var recvAddr = eventHubName + '/ConsumerGroups/$default/Partitions/';

var amqpClient = new AMQPClient(Policy.EventHub);
var io = require('socket.io-emitter')({ host: '10.31.0.13', port: 6379 });

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

var filterOffset = new Date().getTime();
var filterOption;
if (filterOffset) {
    filterOption = {
        attach: { source: { filter: {
            'apache.org:selector-filter:string': translator(
                ['described', ['symbol', 'apache.org:selector-filter:string'], ['string', "amqp.annotation.x-opt-enqueuedtimeutc > " + filterOffset + ""]])
        } } }
    };
}

var messageHandler = function (partitionId, message) {
    console.log('Received(' + partitionId + '): ', message.body);
    io.emit('azure:message', message);

};

var errorHandler = function(partitionId, err) {
    console.warn('** Receive error: ', err);
};

var createPartitionReceiver = function(partitionId, receiveAddress, filterOption) {
    return amqpClient.createReceiver(receiveAddress, filterOption)
        .then(function (receiver) {
            console.log('Listening on partition: ' + partitionId);
            receiver.on('message', messageHandler.bind(null, partitionId));
            receiver.on('errorReceived', errorHandler.bind(null, partitionId));
        });
};

client.open(connectCallback);

// Helper function to print results in the console
function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

amqpClient.connect(uri)
    .then(function () {
        console.log("connected");
        var partitions = [];
        for (var i = 0; i < numPartitions; ++i) {
            partitions.push(createPartitionReceiver(i, recvAddr + i, filterOption));
        }
        return Promise.all(partitions);
    })
    .error(function (e) {
        console.warn('Connection error: ', e);
    });

