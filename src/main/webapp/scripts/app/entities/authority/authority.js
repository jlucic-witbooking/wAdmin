'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('authority', {
                parent: 'entity',
                url: '/authority',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'adminApp.authority.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/authority/authoritys.html',
                        controller: 'AuthorityController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('authority');
                        return $translate.refresh();
                    }]
                }
            })
            .state('authorityDetail', {
                parent: 'entity',
                url: '/authority/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'adminApp.authority.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/authority/authority-detail.html',
                        controller: 'AuthorityDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('authority');
                        return $translate.refresh();
                    }]
                }
            });
    });
