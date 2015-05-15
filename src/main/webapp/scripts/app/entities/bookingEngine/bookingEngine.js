'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('bookingEngine', {
                parent: 'entity',
                url: 'bookingEngine',
                data: {
                    roles: ['ROLE_USER','ROLE_ADMIN'],
                    pageTitle: 'adminApp.bookingEngine.home.title'
                },
                views: {
                    'content@layout': {
                        templateUrl: 'scripts/app/entities/bookingEngine/bookingEngines.html',
                        controller: 'BookingEngineController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('bookingEngine');
                        return $translate.refresh();
                    }]
                }
            })
            .state('bookingEngineDetail', {
                parent: 'entity',
                url: 'bookingEngine/:id',
                data: {
                    roles: ['ROLE_USER','ROLE_ADMIN'],
                    pageTitle: 'adminApp.bookingEngine.detail.title'
                },
                views: {
                    'content@layout': {
                        templateUrl: 'scripts/app/entities/bookingEngine/bookingEngine-detail.html',
                        controller: 'BookingEngineDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('bookingEngine');
                        return $translate.refresh();
                    }]
                }
            });
    });
