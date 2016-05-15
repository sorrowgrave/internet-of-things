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

        settingsFactory.getCloudSettings('cloud')
            .success(function (data) {

                vm.cloud = data;

            })
            .error(function (err, status) {
                alert("error from controller" + err)
            });

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


    angular.module('gatewayApp').controller('settingsGatewayController', settingsGatewayController);

    function settingsGatewayController(settingsFactory){

    }


})();
