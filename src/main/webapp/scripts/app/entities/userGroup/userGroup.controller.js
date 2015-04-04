'use strict';

angular.module('adminApp')
    .controller('UserGroupController', function ($scope, UserGroup, User, ParseLinks) {
        $scope.userGroups = [];
        $scope.users = User.query();
        $scope.page = 1;
        $scope.loadAll = function() {
            UserGroup.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.userGroups = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.create = function () {
            UserGroup.update($scope.userGroup,
                function () {
                    $scope.loadAll();
                    $('#saveUserGroupModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            UserGroup.get({id: id}, function(result) {
                $scope.userGroup = result;
                $('#saveUserGroupModal').modal('show');
            });
        };

        $scope.delete = function (id) {
            UserGroup.get({id: id}, function(result) {
                $scope.userGroup = result;
                $('#deleteUserGroupConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            UserGroup.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteUserGroupConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.clear = function () {
            $scope.userGroup = {name: null, id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
