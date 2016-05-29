/**
 * Created by Kenny on 29/05/2016.
 */
/**
 * Created by Kenny on 9/05/2016.
 */


(function () {
    'use strict';

    angular.module('gatewayApp').service('SensorService', ['Sensor', function(Sensor) {

        var forEach = Array.prototype.forEach;

        function SensorService() {
            this.connSensors = [];
            this.sensors = [];
        }

        SensorService.prototype.add = function (sensor, hardware, data) {
            var sensorNode = new Sensor(sensor, hardware, data);
            this.sensors.push(sensorNode);
            this.connSensors.push(sensor);
            console.log("NEW SENSOR ADDED" + sensorNode);

        };

        SensorService.prototype.update = function (sensor, data) {
            forEach.call(this.sensors, function(sens) {
                if(sens.sensor == sensor)
                {
                    sens.data = data;
                    console.log(sens);
                    return true;
                }
            });
        };

        SensorService.prototype.remove = function (sensorNode) {
            var index = this.val.indexOf(sensorNode);
            this.sensors.splice(index, 1);
        };

        SensorService.prototype.check = function (sensor) {
            return $.inArray(sensor, this.connSensors) > -1;
        };

        return SensorService;

    }]);


})();