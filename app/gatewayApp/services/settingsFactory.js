/**
 * Created by Kenny on 5/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp').factory('settingsFactory', settingsFactory);

    var baseUrl = 'http://192.168.1.156';
    var port = '3000';

    var address = baseUrl + ':' + port;

    function settingsFactory($http) {

        return {

            getCloudSettings: function (spec1, spec2) {

                if (spec2 === undefined) spec2 = '';

                return $http.get(address + '/gateway/get/config/' + spec1 + '/' + spec2)

                    .success(function (data, status, headers, config) {})

                    .error(function (data, status, headers, config) {})
            },

            updateCloudSettings: function (cloud) {

                console.log(JSON.stringify(cloud));

                return $http.post(address + '/gateway/modify/config/cloud', cloud)

                    .success(function (data, status, headers, config) {})

                    .error(function (data, status, headers, config) {})
            },

            provokeAmazon: function () {
                return $http.get(address + '/gateway/invoke/script/amazon')

                    .success(function (data, status, headers, config) {})

                    .error(function (data, status, headers, config) {})
            },

            provokeAzure: function () {
                return $http.get(address + '/gateway/invoke/script/azure')

                    .success(function (data, status, headers, config) {})

                    .error(function (data, status, headers, config) {})
            }

        };
    }
})();