'use strict';

/**
 * @ngdoc directive
 * @name bprApp.directive:datetimerangepicker
 * @description
 * # datetimerangepicker
 */
angular.module('bprApp')
  .directive('datetimerangepicker', function () {
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

        var tmpl = '<div class="col-xs-12 col-sm-12 col-md-3"> <div class="input-group"> <div class="input-group-btn">  </div>' +
          "<datetimepicker range-type=\"start\"  type=\"text\" ng-click=\"open($event)\" is-open=\"opened\" ng-model=\"ngModel.start\"  " + [
            ["minDate"],
            ["maxDate"],
            ["dayFormat"],
            ["monthFormat"],
            ["yearFormat"],
            ["dayHeaderFormat"],
            ["dayTitleFormat"],
            ["monthTitleFormat"],
            ["startingDay"],
            ["yearRange"],
            ["showMeridian"],
            ["datepickerOptions", "dateOptions"]
          ].reduce(createAttrConcat, '') +
          createFuncAttr("dateDisabled", "date: date, mode: mode") +
          createEvalAttr("dateFormat") +
          createEvalAttr("placeholder", "placeholder") +
          "></datetimepicker>\n" +
          "</div></div>\n";

        tmpl += '<div class="col-xs-12 col-sm-12 col-md-3"> <div class="input-group"> <div class="input-group-btn">  </div>' +
        "<datetimepicker range-type=\"end\" type=\"text\" ng-click=\"open($event)\" is-open=\"opened\" ng-model=\"ngModel.end\" " + [
          ["minDate"],
          ["maxDate"],
          ["dayFormat"],
          ["monthFormat"],
          ["yearFormat"],
          ["dayHeaderFormat"],
          ["dayTitleFormat"],
          ["monthTitleFormat"],
          ["startingDay"],
          ["yearRange"],
          ["showMeridian"],
          ["datepickerOptions", "dateOptions"]
        ].reduce(createAttrConcat, '') +
        createFuncAttr("dateDisabled", "date: date, mode: mode") +
        createEvalAttr("dateFormat") +
        createEvalAttr("placeholder", "placeholder") +
        "></datetimepicker>\n" +
        "</div></div>\n";

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
      link: function(scope, element,attrs,ngModel) {

        scope.clearAll=function(){
          scope.ngModel.end=null;
          scope.ngModel.start=null;
        };


        scope.change = function (newDate,rangeType) {

          var startDate = rangeType==="start" ? newDate:scope.ngModel.start;
          var endDate   = rangeType==="end"   ? newDate:scope.ngModel.end;

          if (rangeType==="start" && startDate && endDate && startDate >= endDate   ) {
            scope.ngModel.end=moment(startDate).add(1, 'days').toDate();
          }else if(startDate === endDate){
            if (startDate.getHours() > endDate.getHours()   || (startDate.getHours() == endDate.getHours()   && startDate.getMinutes() >= endDate.getMinutes()) ){
              scope.ngModel.end=moment(startDate).add(1, 'hours').toDate();
            }
          }

          if (rangeType==="end" && startDate && endDate && startDate > endDate) {
            scope.ngModel.start=moment(endDate).add(-1, 'days').toDate();
          }else if(startDate === endDate){
            if (startDate.getHours() > endDate.getHours()   || (startDate.getHours() == endDate.getHours()   && startDate.getMinutes() >= endDate.getMinutes()) ){
              scope.ngModel.start=moment(endDate).add(-1, 'hours').toDate();
            }
          }

        };
      }
    }
      ;
  });
