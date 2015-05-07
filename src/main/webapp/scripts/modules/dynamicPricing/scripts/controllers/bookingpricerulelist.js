'use strict';
/**
 * @ngdoc function
 * @name bprApp.controller:BookingpricerulelistCtrl
 * @description
 * # BookingpricerulelistCtrl
 * Controller of the bprApp
 */
angular.module('bprApp')

  .controller('BookingpricerulelistCtrl', ['$scope','$stateParams', 'BookingPriceRuleManager', '$modal','$state', function ($scope,$routeParams, BookingPriceRuleManager, $modal,$state) {


    var establishmentTicker = $routeParams.establishmentTicker;

    $scope.$state = $state;

    $scope.establishmentTicker = establishmentTicker;

    $scope.sortableOptions = {
      stop: function (e, ui) {
        var totalRules = $scope.bookingPriceRules.length;
        for (var index in $scope.bookingPriceRules) {
          var newOrder = totalRules - parseInt(index);
          var bookingPriceRule = $scope.bookingPriceRules[index];
          bookingPriceRule.order = newOrder*100;
          BookingPriceRuleManager.save(establishmentTicker, bookingPriceRule,function(){
            console.log("Save successful");
          });
        }
      }
    };

    $scope.deleteRule = function (bookingPriceRule, index) {
      var ModalInstanceCtrl = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        $scope.ok = function () {
          $modalInstance.close();
        };
        $scope.cancel = function () {
          $modalInstance.dismiss();
        };

      }];

      var modalInstance = $modal.open({
        templateUrl: 'bookingPriceRuleDeleteModal.html',
        controller: ModalInstanceCtrl
      });

      modalInstance.result.then(function () {
        BookingPriceRuleManager.delete(establishmentTicker, bookingPriceRule);
        $scope.bookingPriceRules.splice(index, 1);
      }, function () {

      });
    };
    $scope.rulesMap = BookingPriceRuleManager._pool;

    BookingPriceRuleManager.get(establishmentTicker).then(function (bookingPriceRules) {
      bookingPriceRules.sort(function (a, b) {
        return a.order < b.order;
      });
      $scope.bookingPriceRules = bookingPriceRules;
    });


  }]);
