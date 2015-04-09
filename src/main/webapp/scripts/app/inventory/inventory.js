'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('inventory', {
                abstract: true,
                parent: 'layout',
                url: 'inventory'
            });
    });
