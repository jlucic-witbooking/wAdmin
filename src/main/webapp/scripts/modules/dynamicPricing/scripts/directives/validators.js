'use strict';

/**
 * @ngdoc directive
 * @name bprApp.directive:validators
 * @description
 * # validators
 */
angular.module('bprApp')
  .directive('datetimerange', function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$validators.datetimerange = function (modelValue, viewValue) {
          console.log("testing");

          if (ctrl.$isEmpty(modelValue)) {
            // consider empty models to be valid
            return true;
          }
          if(!viewValue.start || !viewValue.end){
            return false;
          }

          if (viewValue.start < viewValue.end) {
            // it is valid
            return true;
          }

          // it is invalid
          return false;
        };

      }
    };
  });
