'use strict';

angular.module('adminApp')
    .factory('AuthorizedEstablishmentUser', function ($resource) {
        return $resource('api/authorizedEstablishmentUsers/:id', {}, {
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
