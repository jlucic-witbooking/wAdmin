'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('frontEndMessage', {
                parent: 'entity',
                url: 'frontEndMessage',
                data: {
                    roles: ['ROLE_USER','ROLE_ADMIN'],
                    pageTitle: 'adminApp.frontEndMessage.home.title'
                },
                views: {
                    'content@layout': {
                        templateUrl: 'scripts/app/entities/frontEndMessage/frontEndMessages.html',
                        controller: 'FrontEndMessageController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('frontEndMessage');
                        return $translate.refresh();
                    }]
                }
            })
            .state('frontEndMessageDetail', {
                parent: 'entity',
                url: 'frontEndMessage/:id',
                data: {
                    roles: ['ROLE_USER','ROLE_ADMIN'],
                    pageTitle: 'adminApp.frontEndMessage.detail.title'
                },
                views: {
                    'content@layout': {
                        templateUrl: 'scripts/app/entities/frontEndMessage/frontEndMessage-detail.html',
                        controller: 'FrontEndMessageDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('frontEndMessage');
                        return $translate.refresh();
                    }]
                }
            });
    });
