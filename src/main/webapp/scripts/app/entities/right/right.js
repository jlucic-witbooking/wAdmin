'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('right', {
                parent: 'entity',
                url: '/right',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'adminApp.right.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/right/rights.html',
                        controller: 'RightController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('right');
                        return $translate.refresh();
                    }]
                }
            })
            .state('rightDetail', {
                parent: 'entity',
                url: '/right/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'adminApp.right.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/right/right-detail.html',
                        controller: 'RightDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('right');
                        return $translate.refresh();
                    }]
                }
            });
    });
