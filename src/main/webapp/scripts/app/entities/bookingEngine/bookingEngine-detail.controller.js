'use strict';

angular.module('adminApp')
    .controller('BookingEngineDetailController', function ($scope, $stateParams, BookingEngine) {
        $scope.bookingEngine = {};
        $scope.load = function (id) {
            BookingEngine.get({id: id}, function(result) {
              $scope.bookingEngine = result;
            });
        };
        $scope.load($stateParams.id);
    });
