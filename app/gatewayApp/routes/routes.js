/**
 * Created by Kenny on 2/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp').config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $urlRouterProvider.rule(function($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = path[path.length-1] === '/';

            if(hasTrailingSlash) {

                //if last charcter is a slash, return the same url without the slash
                var newPath = path.substr(0, path.length - 1);
                return newPath;
            }

        });

        $urlRouterProvider.when('/settings/gateway', '/settings/gateway/general');
        $urlRouterProvider.when('/settings/cloud', '/settings/cloud/amazon');

        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'views/partial-home.html'

            })

            .state('about', {
                url: '/about',
                templateUrl: 'views/partial-about.html'
            })

            .state('features', {
                url: '/features',
                templateUrl: 'views/features/partial-features.html'
            })

            .state('features.amazon', {
                url: '/amazon',
                templateUrl: 'views/features/partial-features-amazon.html',
                controller: 'amazonController',
                controllerAs: 'amazonCtrl',


            })

            .state('features.azure', {
                url: '/azure',
                templateUrl: 'views/features/partial-features-azure.html',
                controller: 'azureController',
                controllerAs: 'azureCtrl'

            })

            .state('contact', {
                url: '/contact',
                templateUrl: 'views/partial-contact.html'

            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'views/settings/partial-settings.html',
                controller: 'settingsController',
                controllerAs: 'settingsCtrl'

            })

            .state('settings.gateway', {
                url: '/gateway',
                templateUrl: 'views/settings/partial-settings-gateway.html',
                controller: 'settingsGatewayController',
                controllerAs: 'settingsGatewayCtrl'
            })

            .state('settings.gateway.general', {
                url: '/general'

            })

            .state('settings.gateway.amazon', {
                url: '/amazon'
            })

            .state('settings.gateway.azure', {
                url: '/azure'
            })

            .state('settings.cloud', {
                url: '/cloud',
                templateUrl: 'views/settings/partial-settings-cloud.html',
                controller: 'settingsCloudController',
                controllerAs: 'settingsCloudCtrl'

            })

            .state('settings.cloud.amazon', {
                url: '/amazon'

            })

            .state('settings.cloud.azure', {
                url: '/azure'

            })

            .state('settings.backup', {
                url: '/backup'

            })

            .state('settings.network', {
                url: '/network'

            })

            .state('settings.help', {
                url: '/help'

            })


        });

})();
