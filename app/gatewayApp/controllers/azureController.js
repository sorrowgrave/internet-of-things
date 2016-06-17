/**
 * Created by Kenny on 4/05/2016.
 */


(function () {
    'use strict';
    angular.module('gatewayApp').controller('azureController', ['LogService', 'SensorService', 'settingsFactory', 'socketFactory', azureController]);


    function azureController(LogService, SensorService, settingsFactory, socketFactory) {

        var vm = this;

        vm.gatewayStatus = "On";
        vm.settingsFact = settingsFactory;
        vm.logs = new LogService();
        vm.sensorService = new SensorService();

        socketFactory.on('azure:message', function (data) {

            var content = data.message.body;

            vm.logs.log("Message Arrived in: " + data.host);

            if(!vm.sensorService.check(content.sensor))
            {
                vm.sensorService.add(content.sensor, content.hardware, content.data)
            }
            else
            {
                vm.sensorService.update(content.sensor, content.data);
            }

        });

        socketFactory.on('azure:scriptstatus', function (msg) {

            console.log(msg);
            vm.gatewayStatus = msg;
        });

    }

    azureController.prototype.provokeAzure = function () {

        var vm = this;
        vm.cooldown = true;
        var log;

        vm.settingsFact.provokeAzure()
            .success(function (data) {

                log = data ? "On" : "Off";
                vm.logs.log("Successfully turned " + log);
                vm.cooldown = false;

            })
            .error(function (err, status) {

                vm.logs.logError("Failed to process request " + err);
                vm.gatewayStatus = "Error";
            });


    }

})();