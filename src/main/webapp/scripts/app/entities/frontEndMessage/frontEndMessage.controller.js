'use strict';

angular.module('adminApp')
    .controller('FrontEndMessageController', function ($scope, FrontEndMessage, ParseLinks) {
        $scope.frontEndMessages = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            FrontEndMessage.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.frontEndMessages.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.frontEndMessages = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.create = function () {
            FrontEndMessage.update($scope.frontEndMessage,
                function () {
                    $scope.reset();
                    $('#saveFrontEndMessageModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            FrontEndMessage.get({id: id}, function(result) {
                $scope.frontEndMessage = result;
                $('#saveFrontEndMessageModal').modal('show');
            });
        };

        $scope.delete = function (id) {
            FrontEndMessage.get({id: id}, function(result) {
                $scope.frontEndMessage = result;
                $('#deleteFrontEndMessageConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            FrontEndMessage.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteFrontEndMessageConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.clear = function () {
            $scope.frontEndMessage = {username: null, editedName: null, description: null, title: null, position: null, type: null, hidden: null, unavailable: null, start: null, end: null, creation: null, lastModification: null, id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
