'use strict';

angular.module('adminApp')
    .controller('AuthorizedEstablishmentUserController', function ($scope,ngDialog, AuthorizedEstablishmentUser, User, UserGroup, Authority, BookingEngine, ParseLinks) {
        $scope.authorizedEstablishmentUsers = [];
        $scope.users = User.query();
        $scope.usergroups = UserGroup.query();
        $scope.authoritys = Authority.query();
        $scope.bookingengines = BookingEngine.query();
        $scope.page = 1;
        $scope.loadAll = function() {
            AuthorizedEstablishmentUser.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.authorizedEstablishmentUsers.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.authorizedEstablishmentUsers = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.create = function () {
            AuthorizedEstablishmentUser.update($scope.authorizedEstablishmentUser,
                function () {
                    $scope.reset();
                    $('#saveAuthorizedEstablishmentUserModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            AuthorizedEstablishmentUser.get({id: id}, function(result) {
                $scope.authorizedEstablishmentUser = result;
                //$('#saveAuthorizedEstablishmentUserModal').modal('show');
                ngDialog.open({
                    template: 'saveAuthorizedEstablishmentUserModalTemplate',
                    scope: $scope
                });
            });
        };

        $scope.delete = function (id) {
            AuthorizedEstablishmentUser.get({id: id}, function(result) {
                $scope.authorizedEstablishmentUser = result;
/*
                $('#deleteAuthorizedEstablishmentUserConfirmation').modal('show');
*/
                ngDialog.open({
                    template: 'deleteAuthorizedEstablishmentUserConfirmationTemplate',
                    scope: $scope
                });

            });

        };

        $scope.confirmDelete = function (id) {
            AuthorizedEstablishmentUser.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteAuthorizedEstablishmentUserConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.clear = function () {
            $scope.authorizedEstablishmentUser = {id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
