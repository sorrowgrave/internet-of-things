/**
 * Created by Kenny on 3/05/2016.
 */

(function () {
    'use strict';

    angular.module('gatewayApp').controller('settingsController', settingsController);

    function settingsController(settingsFactory) {

        var vm = this;

        vm.cloud = {};
        vm.backUp = {};
        vm.sensorNet = {};

        vm.getCloud = function () {

            //alert('test');

            settingsFactory.getCloudSettings()
                .success(function (data) {

                    console.log(data + ";e;e");

                    vm.cloud = data;

                    //alert("data received");


                })
                .error(function (err, status) {
                    alert("error from controller" + err)
                })

        }

        vm.updateCloud = function () {

            alert("reached controller");
            settingsFactory.updateCloudSettings(vm.cloud)
                .success(function (data) {

/*                    vm.amazon = data.amazon;
                    vm.azure = data.azure;*/

                    //alert("data received");


                })
                .error(function (err, status) {
                    alert("error from controller" + err)
                })

        }

    }


})();
