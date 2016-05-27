/**
 * Created by Kenny on 3/05/2016.
 */


(function () {
    'use strict';

    angular.module("gatewayApp")

        .directive('filebrowser', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                document.getElementById('file').change();

            }
        };
    }])
})();