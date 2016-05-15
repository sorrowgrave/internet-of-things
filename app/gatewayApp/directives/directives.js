/**
 * Created by Kenny on 3/05/2016.
 */


(function () {
    'use strict';

    angular.module("gatewayApp")

        .directive('rotate', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    rotate(element);
                });
            }
        };
    }]).directive('switch', ['frapontillo.bootstrap-switch']) ;
})();