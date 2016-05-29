/**
 * Created by Kenny on 25/05/2016.
 */



    var serialport = require("serialport");
    var SerialPort = serialport.SerialPort;

    var xbee_api = require('xbee-api');
    var C = xbee_api.constants;

    var data;

    var xbeeAPI = new xbee_api.XBeeAPI({
        api_mode: 1

    });

    var port = new SerialPort('/dev/ttyUSB0', {
        baudrate: 9600,
        parser: xbeeAPI.rawParser(1000)

    }, false);

    port.open(function (err) {
        if (err) {
            return console.log('Error opening port: ', err.message);
        }

        console.log("open");
        port.write('main screen turn on');

        port.on('data', function (data) {

            console.log(data);
            /*            if (!isNaN(data))
             thingShadows.publish('temp', data);*/

        });

        // errors will be emitted on the port since there is no callback to write

    });

    xbeeAPI.on("frame_object", function (frame) {

        data = (frame.data).toString("UTF-8");

        console.log(">>", data);

    });