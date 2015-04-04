'use strict';

angular.module('adminApp')
    .controller('UserGroupDetailController', function ($scope, $stateParams, UserGroup, User) {
        $scope.userGroup = {};
        $scope.load = function (id) {
            UserGroup.get({id: id}, function(result) {
              $scope.userGroup = result;
            });
        };
        $scope.load($stateParams.id);
    });
