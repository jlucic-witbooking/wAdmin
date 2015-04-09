'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('layout', {
                parent: 'site',
                url: '/',
                data: {
                    roles: []
                },
                views: {
                    'layout@': {
                        templateUrl: 'scripts/components/layout/layout.html',
                        controller: 'MainController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('main');
                        $translatePartialLoader.addPart('sidebar');
                        return $translate.refresh();
                    }]
                }
            })
    });
