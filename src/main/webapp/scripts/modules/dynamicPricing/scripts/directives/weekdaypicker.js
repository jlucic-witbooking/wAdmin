'use strict';

/**
 * @ngdoc directive
 * @name bprApp.directive:weekdaypicker
 * @description
 * # weekdaypicker
 */
angular.module('bprApp')
  .directive('weekdaypicker', function () {
    return {
      restrict: 'AE',
      scope:{
        "model":"=",
        "weekDays":"="
      },
      link: function postLink(scope, element, attrs) {

        scope.uncheckAll = function (property) {
          while (scope.model.length) {
            scope.model.pop();
          }
        };

        scope.checkAll = function (property) {
          scope.uncheckAll(property);
          scope.weekDays.map(function (item) {
            scope.model.push(item);
          });
        };

      },
      template: function(elem, attrs) {

        var tmpl =
            '<div class=" col-xs-12 col-sm-10 col-md-11 col-sm-height col-middle  ">'+
            '  <div ng-repeat="day in weekDays" class="col-md-1 seven-cols middleDay">'+
            '  <label class="checkbox-inline">'+
            ' <input type="checkbox"'+
            '  checklist-model="model"'+
            '  checklist-value="day">'+
            " <span>{{'trans.'+day | translate}}</span>"+
            '</label>'+
            '</div>'+
            '</div>'+
            '<button class="btn btn-default selectMultipleButton" ng-click="checkAll(\'contractWeekDaysConditionDays\')">'+
            "{{'trans.selectAll' | translate}}"+
            '</button>'+
            '<button class="btn btn-default selectMultipleButton" ng-click="uncheckAll(\'contractWeekDaysConditionDays\')">'+
            "{{'trans.unselectAll' | translate}}"+
            '</button>';

        return tmpl;
      }
    }
  });
