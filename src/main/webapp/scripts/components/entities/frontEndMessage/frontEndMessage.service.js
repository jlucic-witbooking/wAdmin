'use strict';

angular.module('adminApp')
    .factory('FrontEndMessage', function ($resource) {
        return $resource('api/frontEndMessages/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.start = new Date(data.start);
                    data.end = new Date(data.end);
                    data.creation = new Date(data.creation);
                    data.lastModification = new Date(data.lastModification);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
