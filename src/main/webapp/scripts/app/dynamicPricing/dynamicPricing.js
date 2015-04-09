'use strict';

angular.module('adminApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('dynamicPricing', {
                parent: 'layout',
                url: 'dynamicPricing',
                data: {
                    roles: ['ROLE_ADMIN','ROLE_USER'],
                    rights: ['CAN_MANAGE_INVENTORY'],
                    pageTitle: 'adminApp.dynamicPricing.home.title'
                },
                views: {
                    'content@layout': {
                        templateUrl: 'scripts/app/dynamicPricing/dynamicPricing.html',
                        controller: 'DynamicPricingController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('dynamicPricing');
                        return $translate.refresh();
                    }]
                }
            })
    });
