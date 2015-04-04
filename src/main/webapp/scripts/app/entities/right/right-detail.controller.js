'use strict';

angular.module('adminApp')
    .controller('RightDetailController', function ($scope, $stateParams, Right) {
        $scope.right = {};
        $scope.load = function (id) {
            Right.get({id: id}, function(result) {
              $scope.right = result;
            });
        };
        $scope.load($stateParams.id);
    });
