'use strict';

angular.module('adminApp')
    .controller('RightController', function ($scope, Right, ParseLinks) {
        $scope.rights = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            Right.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.rights.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.rights = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.create = function () {
            Right.update($scope.right,
                function () {
                    $scope.reset();
                    $('#saveRightModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            Right.get({id: id}, function(result) {
                $scope.right = result;
                $('#saveRightModal').modal('show');
            });
        };

        $scope.delete = function (id) {
            Right.get({id: id}, function(result) {
                $scope.right = result;
                $('#deleteRightConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Right.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteRightConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.clear = function () {
            $scope.right = {name: null, description: null, id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
