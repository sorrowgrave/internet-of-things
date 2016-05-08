/**
 * Created by Kenny on 5/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp').factory('settingsFactory', settingsFactory);

    //settingsFactory.$inject = ['$http'];

    function settingsFactory($http) {
        var factory = {};

        factory.getCloudSettings = function () {

            return $http.get('http://localhost:3000/gateway/get/config/cloud')

                .success(function (data, status, headers, config) {

/*                    alert("Ok." + data);
                    return data;*/

                })

                .error(function (data, status, headers, config) {
                    alert("Error." + status);
                })
        };

        factory.updateCloudSettings = function (cloud) {

            var data = {"cloud":"test"};

            console.log(JSON.stringify(cloud));

            return $http.post('http://localhost:3000/gateway/modify/config/cloud', cloud)

                .success(function (data, status, headers, config) {

                    alert("Ok." + data);
                    return data;

                })

                .error(function (data, status, headers, config) {
                    alert("Error." + status);
                })
        };

        return factory;
    }
})();