// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngAnimate', 'ngRoute'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html'
                    })

                    .state('app.search', {
                        url: '/search',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/search.html',
                                controller: 'SearchCtrl'
                            }
                        }
                    })

                    .state('app.browse', {
                        url: '/browse',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/browse.html',
                                controller: 'BrowserCtrl'
                            }
                        }
                    })
                    
                    .state('app.identify', {
                        url: '/identify?list',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/identify.html',
                                controller: 'identifyCtrl'
                            }
                        }
                    })

                    //plantilla modificada para el mapa
                    .state('app.playlists', {
                        //url: '/playlists?placa',
                        url: '/playlists?placa&coorX&coorY&radio&zona',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/playlists.html',
                                controller: 'MapCtrl'
                            }
                        }
                    })

                    .state('app.login', {
                        url: '/login',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/login.html',
                                controller: 'AppCtrl'
                            }
                        }
                    })


                    .state('app.playlist', {
                        url: '/playlist?area_hec&estado_juridico&fecha_radica_inscribe&minerales&modalidad&municipios&personas&placa&tipo_expediente&',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/playlist.html',
                                controller: 'PlacaCtrl'
                            }
                        }
                    });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/login');
        });
