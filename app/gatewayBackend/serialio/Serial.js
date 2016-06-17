/**
 * Created by Kenny on 25/05/2016.
 */

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var xbee_api = require('xbee-api');
var Message = require('azure-iot-device').Message;

var config = require('../data/settings.json').configuration.gateway.general;
var serialPort = config.serialPort;
var baudRate = config.baudRate;

var C = xbee_api.constants;

var data;

var sendMethod;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var port = new SerialPort(serialPort, {
    baudrate: baudRate,
    parser: xbeeAPI.rawParser(1000)

}, false);


module.exports = function (cloud, client) {
    'use strict';

    CreateSender(cloud, client);

        port.open(function (err) {
            if (err) {
                return console.log('Error opening port: ', err.message);
            }

            console.log("open");

            port.on('data', function (data) {
                console.log(data);
                sendMethod(data);
            });
        });

        xbeeAPI.on("frame_object", function (frame) {
            data = (frame.data).toString("UTF-8");
            console.log(">>", data);
            sendMethod(data);
        });
};

function CreateSender(cloud, client){
    if(cloud == "amazon")
    {
        sendMethod = function (data) {
            client.publish('temp', data);
        };
    }
    else
    {
        sendMethod = function (data) {
            var message = new Message(data);
            client.sendEvent(message);
        };
    }
}