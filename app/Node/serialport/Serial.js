/**
 * Created by Kenny on 25/05/2016.
 */

module.exports = function (serialPort) {

    var serialport = require("serialport");
    var SerialPort = serialport.SerialPort;

    var xbee_api = require('xbee-api');

    var C = xbee_api.constants;

    var data;

    var xbeeAPI = new xbee_api.XBeeAPI({
        api_mode: 1

    });

    var serialPort = new SerialPort("/dev/ttyUSB0", {
        baudrate: 9600,
        parser: xbeeAPI.rawParser(1000)

    }, false);

    serialPort.on("open", function () {
        console.log('open');
        //myLoop();                      //  start the loop

        var frame_obj = {
            type: 0x10,
            id: 0x01,
            destination64: "0013A20040F2A818",
            broadcastRadius: 0x00,
            options: 0x00,
            data: "Hello world"
        };

        serialPort.on('data', function (data) {

            console.log(data);
/*            if (!isNaN(data))
                thingShadows.publish('temp', data);*/

        });
    });

    // All frames parsed by the XBee will be emitted here

    xbeeAPI.on("frame_object", function (frame) {

        data = (frame.data).toString("UTF-8");

        console.log(">>", data);
        thingShadows.publish('temp', data)

    });


};