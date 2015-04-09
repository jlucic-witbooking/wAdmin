'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('management', {
                parent: 'inventory',
                url: '/management',
                data: {
                    roles: ['ROLE_ADMIN','ROLE_USER'],
                    rights: ['CAN_MANAGE_INVENTORY'],
                    pageTitle: 'adminApp.inventory.management.home.title'
                },
                views: {
                    'content@layout': {
                        templateUrl: 'scripts/app/inventory/management/management.html',
                        controller: 'InventoryManagementController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('inventory');
                        return $translate.refresh();
                    }]
                }
            })
    });
