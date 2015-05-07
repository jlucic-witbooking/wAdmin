'use strict';

/**
 * @ngdoc directive
 * @name bprApp.directive:timerangepicker
 * @description
 * # timerangepicker
 */
angular.module('bprApp')
  .directive('timerangepicker', function () {
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        ngModel:'=',
        timezoneModel: '=',
        dayFormat: "=",
        monthFormat: "=",
        yearFormat: "=",
        dayHeaderFormat: "=",
        dayTitleFormat: "=",
        monthTitleFormat: "=",
        showWeeks: "=",
        startingDay: "=",
        yearRange: "=",
        dateFormat: "=",
        minDate: "=",
        maxDate: "=",
        dateOptions: "=",
        dateDisabled: "&",
        hourStep: "=",
        minuteStep: "=",
        showMeridian: "=",
        meredians: "=",
        mousewheel: "=",
        placeholder: "=",
        readonlyTime: "@",
        timezones: "="
      },
      template: function(elem, attrs) {
        function dashCase(name, separator) {
          return name.replace(/[A-Z]/g, function(letter, pos) {
            return (pos ? '-' : '') + letter.toLowerCase();
          });
        }

        function createAttr(innerAttr, dateTimeAttrOpt) {
          var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
          if (attrs[dateTimeAttr]) {
            return dashCase(innerAttr) + "=\"" + dateTimeAttr + "\" ";
          } else {
            return '';
          }
        }

        function createFuncAttr(innerAttr, funcArgs, dateTimeAttrOpt) {
          var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
          if (attrs[dateTimeAttr]) {
            return dashCase(innerAttr) + "=\"" + dateTimeAttr + "({" + funcArgs + "})\" ";
          } else {
            return '';
          }
        }

        function createEvalAttr(innerAttr, dateTimeAttrOpt) {
          var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
          if (attrs[dateTimeAttr]) {
            return dashCase(innerAttr) + "=\"" + attrs[dateTimeAttr] + "\" ";
          } else {
            return dashCase(innerAttr);
          }
        }

        function createAttrConcat(previousAttrs, attr) {
          return previousAttrs + createAttr.apply(null, attr)
        }


        var tmpl = '<div class="col-xs-12 col-sm-12 col-md-3  "> ' +
          "<timepicker ng-change=\"change('start')\" ng-model=\"ngModel.start\"" + [
            ["hourStep"],
            ["minuteStep"],
            ["showMeridian"],
            ["meredians"],
            ["mousewheel"]
          ].reduce(createAttrConcat, '') +
          createEvalAttr("readonlyInput", "readonlyTime") +
          "></timepicker>\n" +
          "</div>\n";

        tmpl += '<div class="col-xs-12 col-sm-12 col-md-3  ">' +
        "<timepicker ng-change=\"change('end')\" ng-model=\"ngModel.end\"" + [
          ["hourStep"],
          ["minuteStep"],
          ["showMeridian"],
          ["meredians"],
          ["mousewheel"]
        ].reduce(createAttrConcat, '') +
        createEvalAttr("readonlyInput", "readonlyTime") +
        "></timepicker>\n" +
        "</div>\n";

        tmpl += '<div class="col-xs-12 col-sm-12 col-md-3 timeZonePicker">'+
        '<div class="input-group">'+
        '<select id="contractDateTimezonePicker" ' +
        'class="form-control" ng-model="timezoneModel" ng-options="key for (key,value) in timezones">'+
        '</select>'+
        '</div>'+
        '</div>';

        tmpl += '<div class="col-xs-12 col-sm-12 col-md-3 timeZonePicker"> <button class="btn btn-default selectMultipleButton  " ng-click="clearAll()">'+
        "{{'trans.clear' | translate}}"+
        '</button>'+
        '</div>';

        return tmpl;

      },
      controller: ['$scope',
        function($scope) {

        }
      ],
      link: function(scope, element,attrs) {

        scope.clearAll=function(){
          scope.ngModel.start =  new Date();
          scope.ngModel.end =new Date();
          scope.ngModel.end.setHours(0,0);
          scope.ngModel.start.setHours(0,0);
        };

        scope.change = function (rangeType) {

          var startDate = scope.ngModel.start;
          var endDate   = scope.ngModel.end;

          if (rangeType==="start" && startDate && endDate && (startDate.getHours() > endDate.getHours()  || (startDate.getHours() == endDate.getHours()  && startDate.getMinutes() >= endDate.getMinutes()))  ) {
            scope.ngModel.end=moment(startDate).add(1, 'hours').toDate();
          }
          if (rangeType==="end" && startDate && endDate && (startDate.getHours() > endDate.getHours()   || (startDate.getHours() == endDate.getHours()   && startDate.getMinutes() >= endDate.getMinutes()))   ) {
            scope.ngModel.start=moment(endDate).add(-1, 'hours').toDate();
          }
        };

      }
    };
  });
