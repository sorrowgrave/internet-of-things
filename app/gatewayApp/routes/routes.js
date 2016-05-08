/**
 * Created by Kenny on 2/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp', ['ui.router', 'ngResource']).config(function($stateProvider, $urlRouterProvider) {

        //$urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/', {
                url: '/',
                templateUrl: 'views/partial-home.html'

            })

            .state('about', {
                url: '/about',
                templateUrl: 'views/partial-about.html'
            })

            .state('features', {
                url: '/features',
                templateUrl: 'views/partial-features.html',
                controller: 'appController',
                controllerAs: 'vm'
            })

            .state('contact', {
                url: '/contact',
                templateUrl: 'views/partial-contact.html'

            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'views/partial-settings.html',
                controller: 'settingsController',
                controllerAs: 'settingsCtrl',
                resolve: {
                    settingsFactory: 'settingsFactory'
                    }

            })
        });

})();
