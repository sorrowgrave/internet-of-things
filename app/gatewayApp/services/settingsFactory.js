/**
 * Created by Kenny on 5/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp').factory('settingsFactory', settingsFactory);

    //settingsFactory.$inject = ['$http'];

    function settingsFactory($http) {
        var factory = {};

        factory.getCloudSettings = function (spec1, spec2) {

            if (spec2 === undefined) spec2 = '';

            return $http.get('http://localhost:3000/gateway/get/config/' + spec1 + '/' + spec2)

                .success(function (data, status, headers, config) {


                })

                .error(function (data, status, headers, config) {
                    alert("Error." + status);
                })
        };

        factory.updateCloudSettings = function (cloud) {

            console.log(JSON.stringify(cloud));

            return $http.post('http://localhost:3000/gateway/modify/config/cloud', cloud)

                .success(function (data, status, headers, config) {


                })

                .error(function (data, status, headers, config) {
                    alert("Error." + status);
                })
        };

        return factory;
    }
})();