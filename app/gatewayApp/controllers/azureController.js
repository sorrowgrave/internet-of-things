/**
 * Created by Kenny on 4/05/2016.
 */


(function () {
    'use strict';
    angular.module('gatewayApp').controller('azureController', ['$scope', 'LogService', 'ClientServiceCache', 'settingsFactory', 'socketFactory', azureController]);


    function azureController(scope, LogService, ClientServiceCache, settingsFactory, socketFactory) {

        var vm = this;

        vm.settingsFact = settingsFactory;
        vm.logs = new LogService();

        socketFactory.on('connection', function () {
            console.log("lelele");
        });

        socketFactory.on('azure:message', function (msg) {

            console.log(msg.body);
            vm.message = msg.body.windSpeed;
        });


    }

    azureController.prototype.invokeAzure = function (scope, LogService) {

        var vm = this;
        vm.cooldown = true;
        var log;

        vm.settingsFact.invokeAzure()
            .success(function (data) {

                log = data ? "On" : "Off";
                vm.logs.log("successfully turned " + log);
                vm.gatewayStatus = data ? "Off" : "On";
                vm.cooldown = false;

            })
            .error(function (err, status) {

                vm.logs.logError("Failed processing request: " + err);
                vm.gatewayStatus = "Error";
                vm.cooldown = false;
            });


    }

})();