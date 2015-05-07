'use strict';

/**
 * @ngdoc overview
 * @name bprApp
 * @description
 * # bprApp
 *
 * Main module of the application.
 */

angular.module('bprApp', [
    'ui.router',
    'ui.sortable',
    'ui.bootstrap',
    'pascalprecht.translate',
    'frapontillo.bootstrap-duallistbox',
    'checklist-model',
    'ngResource',
    'ui.bootstrap.datetimepicker'
])
    .config(['$translateProvider', 'SUPPORTED_LANGUAGES', 'DEFAULT_LANGUAGE', 'TRANSLATIONS', function ($translateProvider, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, TRANSLATIONS) {
        var locale = typeof LOCALE !== "undefined" ? LOCALE : DEFAULT_LANGUAGE;
        for (var i = 0; i < SUPPORTED_LANGUAGES.length; i++) {
            var language = SUPPORTED_LANGUAGES[i]; //es,en, etc.
            $translateProvider.translations(language, TRANSLATIONS[language])
        }
        $translateProvider.preferredLanguage(locale);
    }])
    .constant('DYNAMIC_PRICING_TEMPLATE_LOCATION', 'scripts/modules/dynamicPricing/views/')
    .config(function ($stateProvider,DYNAMIC_PRICING_TEMPLATE_LOCATION) {
        $stateProvider
            .state('newRule', {
                parent: 'dynamicPricing',
                url: '/bookingPriceRule/:establishmentTicker/new',
                data: {
                    roles: ['ROLE_USER','ROLE_ADMIN'],
                    pageTitle: 'adminApp.authorizedEstablishmentUser.home.title'
                },
                views: {
                    'moduleContent': {
                        templateUrl: DYNAMIC_PRICING_TEMPLATE_LOCATION+'bookingpricerule.html',
                        controller: 'BookingpriceruleCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('authorizedEstablishmentUser');
                        return $translate.refresh();
                    }]
                }
            })
            .state('ruleList', {
                parent: 'dynamicPricing',
                url: '/bookingPriceRule/:establishmentTicker/list',
                data: {
                    roles: ['ROLE_USER','ROLE_ADMIN'],
                    pageTitle: 'adminApp.authorizedEstablishmentUser.home.title'
                },
                views: {
                    'moduleContent': {
                        templateUrl:  DYNAMIC_PRICING_TEMPLATE_LOCATION+'bookingpricerulelist.html',
                        controller: 'BookingpricerulelistCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('authorizedEstablishmentUser');
                        return $translate.refresh();
                    }]
                }
            })
            .state('ruleDetail', {
                parent: 'dynamicPricing',
                url: '/bookingPriceRule/:establishmentTicker/:id',
                data: {
                    roles: ['ROLE_USER','ROLE_ADMIN'],
                    pageTitle: 'adminApp.authorizedEstablishmentUser.home.title'
                },
                views: {
                    'moduleContent': {
                        templateUrl:  DYNAMIC_PRICING_TEMPLATE_LOCATION+'bookingpricerule.html',
                        controller: 'BookingpriceruleCtrl'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('authorizedEstablishmentUser');
                        return $translate.refresh();
                    }]
                }
            })
    });
