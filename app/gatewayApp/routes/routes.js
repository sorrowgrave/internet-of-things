/**
 * Created by Kenny on 2/05/2016.
 */
(function () {
    'use strict';

    angular.module('gatewayApp', ['ui.router']).config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/index');

        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'views/partial-home.html'

            })

            .state('about', {
                url: '/about',
                templateUrl: 'views/partial-about.html'
            })

            .state('contact', {
                url: '/contact',
                templateUrl: 'views/partial-contact.html'

            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'views/partial-settings.html'


            })
        });

})();
