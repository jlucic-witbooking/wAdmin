'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'layout',
                url: '/',
                data: {
                    roles: ['ROLE_ADMIN']
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('main');
                        return $translate.refresh();
                    }]
                }
            })

    });
