'use strict';

angular.module('adminApp')
    .controller('AuthorizedEstablishmentUserDetailController', function ($scope, $stateParams, AuthorizedEstablishmentUser, User, UserGroup, Authority, BookingEngine) {
        $scope.authorizedEstablishmentUser = {};
        $scope.load = function (id) {
            AuthorizedEstablishmentUser.get({id: id}, function(result) {
              $scope.authorizedEstablishmentUser = result;
            });
        };
        $scope.load($stateParams.id);
    });
