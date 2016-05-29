/**
 * Created by Kenny on 28/05/2016.
 */
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var crypto = require('crypto');


var connectionString = 'HostName=raspberry-pxl.azure-devices.net;DeviceId=raspberry-pi;SharedAccessKey=oPiwMygHx2KFVqi1SrAJVRUiLwsYNlnIRV9lWgTEjJ4=';

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Mqtt);
var serialPort = require('../serialio/Serial.js')('azure',client);

/*function create_sas_token(uri, key_name, key, hours)
{
    var expiry = Math.floor(new Date().getTime()/1000+3600*hours);

    var string_to_sign = encodeURIComponent(uri) + '\n' + expiry;
    var hmac = crypto.createHmac('sha256', key);
    hmac.update(string_to_sign);
    var signature = hmac.digest('base64');
    var token = 'SharedAccessSignature sr=' + encodeURIComponent(uri) + '&sig=' + encodeURIComponent(signature) + '&se=' + expiry + '&skn=' + key_name;

    return token;
}*/

/*var generateSasToken = function(resourceUri, signingKey, policyName, expiresInMins) {
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
 };*/

// String SharedAccessSignature in the following formats:
//  "SharedAccessSignature sr=<iothub_host_name>/devices/<device_id>&sig=<signature>&se=<expiry>"
/*var sas = create_sas_token('raspberry-pxl.azure-devices.net/devices/raspberry-pi', 'oPiwMygHx2KFVqi1SrAJVRUiLwsYNlnIRV9lWgTEjJ4=', 'iothubowner', 1);

// fromSharedAccessSignature must specify a transport constructor, coming from any transport package.
var client = Client.fromSharedAccessSignature(sas, Mqtt);*/

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