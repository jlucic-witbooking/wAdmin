'use strict';

angular.module('adminApp')
    .controller('BookingEngineController', function ($scope, BookingEngine, ParseLinks) {
        $scope.bookingEngines = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            BookingEngine.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.bookingEngines.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.bookingEngines = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.create = function () {
            BookingEngine.update($scope.bookingEngine,
                function () {
                    $scope.reset();
                    $('#saveBookingEngineModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            BookingEngine.get({id: id}, function(result) {
                $scope.bookingEngine = result;
                $('#saveBookingEngineModal').modal('show');
            });
        };

        $scope.delete = function (id) {
            BookingEngine.get({id: id}, function(result) {
                $scope.bookingEngine = result;
                $('#deleteBookingEngineConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            BookingEngine.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteBookingEngineConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.clear = function () {
            $scope.bookingEngine = {ticker: null, name: null, id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
