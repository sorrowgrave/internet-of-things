/**
 * Created by Kenny on 29/05/2016.
 */
/**
 * Created by Kenny on 9/05/2016.
 */


(function () {
    'use strict';

    angular.module('gatewayApp').service('Sensor', function () {

        function Sensor(sensorName, hardware, data) {
            this.sensor = sensorName;
            this.hardware = hardware;
            this.createdTime = Date.now();
            this.data = data;
        }

        return Sensor;

    });

})();