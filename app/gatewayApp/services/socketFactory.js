/**
 * Created by Kenny on 18/05/2016.
 */
(function() {
    'use strict';

    angular.module('gatewayApp').factory('socketFactory', socketFactory);

    socketFactory.$inject = ['$rootScope', 'address'];

    var socket;

    function socketFactory($rootScope, address) {

        socket = io.connect(address);

        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }
})();