/**
 * Created by Kenny on 4/05/2016.
 */

(function () {
    'use strict';
    angular.module('gatewayApp').controller('restController', restController);

function restController($http) {

    var vm = this;
    vm.endPoint = "";
    vm.region = "";
    vm.clientId = "";
    vm.accessKey = "";
    vm.secretKey = "";


    vm.get = function($setting) {

        // $http.defaults.useXDomain = true;

        //alert($setting);

        var response = $http.get('http://localhost:3000/gateway/get/config/'+ $setting);

        response.success(function(data, status, headers, config) {

            //alert("Ok." + data);

            if(data.hasOwnProperty('amazon'))
            {
                vm.endPoint = data.amazon.endPoint;
                vm.region = data.amazon.region;
                vm.clientId = data.amazon.clientId;
                vm.accessKey = data.amazon.accessKey;
                vm.secretKey = data.amazon.secretKey;
            }

            if(data.hasOwnProperty('azure'))
            {
                vm.connectionString = data.azure.connectionString;
            }


        });

        response.error(function(data, status, headers, config) {
            alert("Error." + status);
        });
    };

}

})();