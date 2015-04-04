'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('authorizedEstablishmentUser', {
                parent: 'entity',
                url: '/authorizedEstablishmentUser',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'adminApp.authorizedEstablishmentUser.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/authorizedEstablishmentUser/authorizedEstablishmentUsers.html',
                        controller: 'AuthorizedEstablishmentUserController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('authorizedEstablishmentUser');
                        return $translate.refresh();
                    }]
                }
            })
            .state('authorizedEstablishmentUserDetail', {
                parent: 'entity',
                url: '/authorizedEstablishmentUser/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'adminApp.authorizedEstablishmentUser.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/authorizedEstablishmentUser/authorizedEstablishmentUser-detail.html',
                        controller: 'AuthorizedEstablishmentUserDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('authorizedEstablishmentUser');
                        return $translate.refresh();
                    }]
                }
            });
    });
