'use strict';

angular.module('adminApp')
    .controller('AuthorityDetailController', function ($scope, $stateParams, Authority, Right) {
        $scope.authority = {};
        $scope.load = function (id) {
            Authority.get({id: id}, function(result) {
              $scope.authority = result;
            });
        };
        $scope.load($stateParams.id);
    });
