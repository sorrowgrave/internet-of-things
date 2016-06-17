/**
 * Created by Kenny on 4/05/2016.
 */

(function () {
    'use strict';

    angular.module('gatewayApp').controller('amazonController', ['$scope', 'LogService', 'ClientServiceCache', 'settingsFactory', amazonController]);

    function amazonController(scope, LogService, ClientServiceCache, settingsFactory) {

        var vm = this;

        vm.settingsFact = settingsFactory;

        vm.settingsFact.getSettings('cloud', 'amazon')
            .success(function (data) {

                console.log(JSON.stringify(data));

                vm.cloud = data;

                vm.clientId = data.clientId;
                vm.endpoint = data.endPoint;
                vm.accessKey = data.accessKey;
                vm.secretKey = data.secretKey;
                vm.regionName = data.region;

                //alert("data received");
            })
            .error(function (err, status) {
                //alert("error from controller" + err)
            });


        vm.logs = new LogService();
        vm.clients = new ClientServiceCache(scope, this.logs);

        vm.gatewayStatus = "On";
    }

    amazonController.$inject = ['$scope'];

    amazonController.prototype.createClient = function() {

        //alert("test");
        //this.logs.test();

        var options = {
            clientId : this.clientId,
            endpoint: this.endpoint.toLowerCase(),
            accessKey: this.accessKey,
            secretKey: this.secretKey,
            regionName: this.regionName
        };
        var client = this.clients.getClient(options);
        if (!client.connected) {
            client.connect(options);
        }
    };

    amazonController.prototype.removeClient = function(clientCtr) {

        this.clients.removeClient(clientCtr);
    };

    amazonController.prototype.provokeAmazon = function() {

        var vm = this;
        vm.cooldown = true;
        var log;

            vm.settingsFact.provokeAmazon()
                .success(function (data) {

                    log = data ? "On" : "Off";
                    vm.logs.log("Successfully turned " + log);
                    vm.gatewayStatus = data ? "Off" : "On";
                    vm.cooldown = false;

                })
                .error(function (err, status) {
                    //alert("error from controller" + err)
                    vm.logs.logError("Failed to process request " + err);
                    vm.gatewayStatus = "Error";
                })
        }

})();