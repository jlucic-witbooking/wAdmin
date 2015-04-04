'use strict';

angular.module('adminApp')
    .factory('BookingEngine', function ($resource) {
        return $resource('api/bookingEngines/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
