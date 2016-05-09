/**
 * Created by Kenny on 9/05/2016.
 */

(function () {
    'use strict';

    angular.module("gatewayApp").directive('amazon', [function () {
        return {
            restrict: 'A',
            controller: 'amazonController',
            controllerAs: 'amazonCtrl',
            templateUrl:'views/partial-amazon.html'
        };
    }

    ]);

})();