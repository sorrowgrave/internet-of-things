/**
 * Created by Kenny on 5/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp').factory('settingsFactory', settingsFactory);

    settingsFactory.$inject = ['$http', 'address'];

    function settingsFactory($http, address) {


        return {

            getSettings: function (spec1, spec2) {

                if (spec2 === undefined) spec2 = '';

                return $http.get(address + '/gateway/get/config/' + spec1 + '/' + spec2)

                    .success(function (data, status, headers, config) {})

                    .error(function (data, status, headers, config) {})
            },

            updateSettings: function (spec1, data) {


                return $http.post(address + '/gateway/modify/config/' + spec1, data)

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