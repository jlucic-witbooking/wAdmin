'use strict';

angular.module('adminApp')
    .controller('FrontEndMessageDetailController', function ($scope, $stateParams, FrontEndMessage) {
        $scope.frontEndMessage = {};
        $scope.load = function (id) {
            FrontEndMessage.get({id: id}, function(result) {
              $scope.frontEndMessage = result;
            });
        };
        $scope.load($stateParams.id);
    });
