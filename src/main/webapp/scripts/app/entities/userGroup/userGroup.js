'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('userGroup', {
                parent: 'entity',
                url: '/userGroup',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'adminApp.userGroup.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/userGroup/userGroups.html',
                        controller: 'UserGroupController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('userGroup');
                        return $translate.refresh();
                    }]
                }
            })
            .state('userGroupDetail', {
                parent: 'entity',
                url: '/userGroup/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'adminApp.userGroup.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/userGroup/userGroup-detail.html',
                        controller: 'UserGroupDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('userGroup');
                        return $translate.refresh();
                    }]
                }
            });
    });
