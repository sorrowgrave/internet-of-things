/**
 * Created by Kenny on 3/05/2016.
 */

(function () {
    'use strict';

    angular.module('gatewayApp').controller('settingsController', settingsController);

    function settingsController(settingsFactory) {

    }

    angular.module('gatewayApp').controller('settingsCloudController', settingsCloudController);

    function settingsCloudController(settingsFactory){

        var vm = this;
        vm.cloud = {};


        settingsFactory.getSettings('cloud')
            .success(function (data) {

                vm.cloud = data;

            })
            .error(function (err, status) {
                //alert("error from controller" + err)
            });

        vm.updateSettings = function () {

            settingsFactory.updateSettings("cloud", vm.cloud)
                .success(function (data) {
                    alert("Settings saved");

                })
                .error(function (err, status) {
                    alert("Failed to save settings" + err)
                })

        }
    }


    angular.module('gatewayApp').controller('settingsGatewayController', settingsGatewayController);

    function settingsGatewayController(settingsFactory){
        var vm = this;
        vm.gateway = {};

        settingsFactory.getSettings('gateway')
            .success(function (data) {

                vm.gateway = data;

            })
            .error(function (err, status) {
                //alert("error from controller" + err)
            });

        vm.updateSettings = function () {

            settingsFactory.updateSettings("gateway", vm.gateway)
                .success(function (data) {
                    alert("Settings saved");

                })
                .error(function (err, status) {
                    alert("Failed to save settings" + err)
                })

        }
    }
})();
