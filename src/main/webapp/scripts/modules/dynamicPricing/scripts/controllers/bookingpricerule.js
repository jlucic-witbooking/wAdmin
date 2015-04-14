'use strict';
/**
 * @ngdoc function
 * @name bprApp.controller:BookingpriceruleCtrl
 * @description
 * # BookingpriceruleCtrl
 * Controller of the bprApp
 */
var placeholder;
angular.module('bprApp')
  .controller('BookingpriceruleCtrl', ['$scope', '$filter', '$stateParams', 'BookingPriceRuleManager', 'BookingPriceRule', 'COUNTRIES', 'CONDITION_TYPE', 'CONDITION_CLASS', 'DEFAULT_DATE_PICKER_SETTINGS',
    'DATE_TIME_FORMAT', 'TIMEZONES', 'DATE_TIME_FORMAT_NO_OFFSET', 'TIME_FORMAT', 'TIME_FORMAT_NO_OFFSET', 'WEEKDAYS', 'DATE_FORMAT', 'DEFAULT_LANGUAGE', '$window', '$location', '$timeout','timezoneDetection',
    function ($scope, $filter, $routeParams, BookingPriceRuleManager, BookingPriceRule, COUNTRIES, CONDITION_TYPE, CONDITION_CLASS, DEFAULT_DATE_PICKER_SETTINGS, DATE_TIME_FORMAT,
              TIMEZONES, DATE_TIME_FORMAT_NO_OFFSET, TIME_FORMAT, TIME_FORMAT_NO_OFFSET, WEEKDAYS, DATE_FORMAT, DEFAULT_LANGUAGE, $window, $location, $timeout,timezoneDetection) {
      $scope.tickerList = $window.tickerList;
      var establishmentTicker = $routeParams.establishmentTicker;
      $scope.establishmentTicker = establishmentTicker;

      $scope.timezones = timezoneDetection.namesMap;
      $scope.contractEntryDate=null;
      $scope.contractExitDate=null;


      var bookingPriceRuleID = $routeParams.id || null;

      if (bookingPriceRuleID) {
        BookingPriceRuleManager.get(establishmentTicker, bookingPriceRuleID)
          .then(
          function (result) {
            initialize(result)
          }, function () {
            alert("Error Occured. Please try again later")
          });
      } else {
        initialize(null);
      }


      function initialize(bookingPriceRule) {
        bookingPriceRule = bookingPriceRule ? bookingPriceRule : new BookingPriceRule();
        placeholder=timezoneDetection;
        var defaultCurrency = typeof CURRENCY !== "undefined" ? CURRENCY : "EUR";
        var locale = typeof LOCALE !== "undefined" ? LOCALE : DEFAULT_LANGUAGE;
        var currentOffset = moment().format("Z");

        var lookupTimezones = {};
        for (var i = 0, len = TIMEZONES.length; i < len; i++) {
          lookupTimezones[TIMEZONES[i].value] = TIMEZONES[i];
        }

        /*It would be much faster to calculate the offset between timezones and apply it to the new Date*/
        var convertToUTC = function (value, offset) {
          var sameTimeWithNewTimezone = moment(value).format(DATE_TIME_FORMAT_NO_OFFSET) + offset;
          var dateObjectWithGivenTimezone = moment(sameTimeWithNewTimezone, DATE_TIME_FORMAT);
          return dateObjectWithGivenTimezone.utc();
        };

        var convertFromUTC = function (value, offset) {
          return moment(value, TIME_FORMAT).toDate();
        };

        function setMinus(A, B) {
          var map = {}, C = [];

          for (var i = B.length; i--;) {
            map[B[i]] = null;
          }
          for (var i = A.length; i--;) {
            if (!map.hasOwnProperty(A[i].id))
              C.push(A[i].id);
          }
          return C;
        }

        function getDefaultTimezone(offset, timezones) {
          for (var i = 0; i < timezones.length; i++) {
            if (timezones[i].offset === offset) {
              return {index: i, timezone: timezones[i]};
            }
          }
          return timezones[0];
        }

        function getTimezoneByValue(value, timezones) {
          return timezones[value];
        }

        $scope.setter = function (property) {
          if (property.indexOf(".") > 0) {
            var objectProperties = property.split('.');
            var caller = $scope;
            for (var i = 0; i < objectProperties.length - 1; i++) {
              caller = caller[objectProperties[i]];
            }
            return caller[objectProperties.length - 1 + "Setter"](caller[objectProperties.length - 1])
          }
          $scope[property + "Setter"]($scope[property]);
        };

        //var defaultTimezone = getDefaultTimezone(currentOffset, TIMEZONES);

        var defaultTimezone = timezoneDetection.currentTimezone();

        var conditions = bookingPriceRule && bookingPriceRule.getConditionsMap() || false;

        $scope.list = [];

        $scope.bookingPriceRule = bookingPriceRule;

        $scope.currency = defaultCurrency || "EUR";
        /****************** TICKER GETTER SETTER***************************************/

        $scope.ticker = function (newValue) {
          if (angular.isDefined(newValue)) {
            bookingPriceRule.ticker = newValue;
          }
          return bookingPriceRule.ticker;
        };

        /****************** END TICKER GETTER SETTER***************************************/

        /****************** PRIORITY GETTER SETTER***************************************/

        $scope.priorities = {
          HIGH: {id: 'HIGH', label: 'HIGH'},
          MEDIUM: {id: 'MEDIUM', label: 'MEDIUM'},
          LOW: {id: 'LOW', label: 'LOW'}
        };

        $scope.rulePriority = function (newValue) {
          if (angular.isDefined(newValue)) {
            bookingPriceRule.rulePriority = newValue.id;
          }
          return $scope.priorities[bookingPriceRule.rulePriority] || null;
        };

        /******************END PRIORITY GETTER SETTER************************************/


        /****************** PRICEVARIATION GETTER SETTER***************************************/
        $scope.priceVariation = Math.abs(bookingPriceRule.priceVariation) || 0 ;
        $scope.setPriceVariation=function(priceVariation){
          var sign=$scope.sign().id === "POSITIVE" ? 1 : -1;
          bookingPriceRule.priceVariation = parseFloat(priceVariation.replace(",","."))*sign;
        };

        /******************END PRICEVARIATION GETTER SETTER************************************/


        /********************* SIGN GETTER SETTER***************************************/
        $scope.signs = [
          {id: 'POSITIVE', label: '+'},
          {id: 'NEGATIVE', label: '-'}
        ];
        var _sign = bookingPriceRule.priceVariation >= 0 ? $scope.signs[0] : $scope.signs[1];
        $scope.sign = function (newValue) {
          if (angular.isDefined(newValue)) {
            var sign = newValue.id === "POSITIVE" ? 1 : -1;
            _sign = newValue.id === "POSITIVE" ?  $scope.signs[0] : $scope.signs[1];
            bookingPriceRule.priceVariation = Math.abs(bookingPriceRule.priceVariation) * sign;
          }
          return _sign;
        };
        /******************END PERCENTAGE GETTER SETTER***************************************/


        /**********************PERCENTAGE GETTER SETTER***************************************/
        $scope.variationTypes = [
          {id: 'AMOUNT', label: $scope.currency},
          {id: 'PERCENT', label: '%'}
        ];
        $scope.percentage = function (newValue) {
          if (angular.isDefined(newValue)) {
            bookingPriceRule.percentage = newValue.id === "PERCENT";
          }
          return bookingPriceRule.percentage ? $scope.variationTypes[1] : $scope.variationTypes[0];
        };
        /******************END PERCENTAGE GETTER SETTER***************************************/

        /********************* COUNTRIES CONDITION GETTER SETTER***************************************/

        $scope.countries = COUNTRIES;

        var getIncludedCountries = function (excludedCountries) {
          return setMinus(COUNTRIES, excludedCountries);
        };
        var _excludedCountries = [];
        var _countryCondition = {
          id: null,
          conditionType: {},
          type: CONDITION_CLASS.COUNTRY_OF_ORIGIN,
          countries: []
        };
        _countryCondition.conditionType[CONDITION_TYPE.ALL] = true;
        if (conditions[CONDITION_CLASS.COUNTRY_OF_ORIGIN]) {
          _countryCondition = conditions[CONDITION_CLASS.COUNTRY_OF_ORIGIN][0];
          if (conditions[CONDITION_CLASS.COUNTRY_OF_ORIGIN][0].conditionType[CONDITION_TYPE.INCLUDE]) {
            _excludedCountries = getIncludedCountries(_countryCondition.countries);
          } else if (conditions[CONDITION_CLASS.COUNTRY_OF_ORIGIN][0].conditionType[CONDITION_TYPE.EXCLUDE]) {
            _excludedCountries = _countryCondition.countries;
          }
        }
        $scope.excludedCountries = function (newValue) {
          if (angular.isDefined(newValue)) {
            _excludedCountries.length = 0;
            _excludedCountries = _excludedCountries.concat(newValue);
            if (_excludedCountries.length === COUNTRIES.length) {
              $scope.bookingPriceRuleForm.excludedCountries.$setValidity("ALL_EXCLUDED", false);
            } else if (_excludedCountries.length > COUNTRIES.length / 2) {
              _countryCondition.conditionType = {};
              _countryCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;
              _countryCondition.conditionType[CONDITION_TYPE.EXACT] = true;
              _countryCondition.countries = getIncludedCountries(_excludedCountries);
            } else if (_excludedCountries.length === 0) {
              _countryCondition.conditionType = {};
              _countryCondition.conditionType[CONDITION_TYPE.ALL] = true;
            } else {
              _countryCondition.conditionType = {};
              _countryCondition.conditionType[CONDITION_TYPE.EXCLUDE] = true;
              _countryCondition.conditionType[CONDITION_TYPE.EXACT] = true;
              _countryCondition.countries = _excludedCountries;
            }
            bookingPriceRule.addCondition(_countryCondition);
          }
          return _excludedCountries;
        };

        /******************END COUNTRIES CONDITION GETTER SETTER***************************************/




        /********************* CONTRACT_DATE CONDITION GETTER SETTER***************************************/
        /*
         {
         "start": "2013-01-01T00:00:00.000+01:00",
         "end": "2014-01-01T00:00:00.000+01:00",
         "timezone": "Europe/Madrid",
         "id": 4,
         "conditionType": {
         "STAY": true
         },
         "type": "DatetimeRangeCondition"
         },
         $scope.toggle = function($event) {
         $event.preventDefault();
         $event.stopPropagation();

         $scope.contractEntryDateOpen = true;
         };

         */
        //DatePicker
 /*       if (!bookingPriceRule) {
          $scope.rangeStartDatePickerOptions = angular.extend({}, DEFAULT_DATE_PICKER_SETTINGS, {
            regional: locale,
            minDate: 0
          });
          $scope.rangeEndDatePickerOptions = angular.extend({}, DEFAULT_DATE_PICKER_SETTINGS, {
            regional: locale,
            minDate: 1
          });
        } else {
          $scope.rangeStartDatePickerOptions = angular.extend({}, DEFAULT_DATE_PICKER_SETTINGS, {regional: locale});
          $scope.rangeEndDatePickerOptions = angular.extend({}, DEFAULT_DATE_PICKER_SETTINGS, {regional: locale});
        }

        $scope.rangeStartSet = function (startModel, endModel) {
          var startDate = $scope.bookingPriceRuleForm[startModel].$viewValue;
          var endDate = $scope.bookingPriceRuleForm[endModel].$viewValue;
          var newEndModelMinDate = moment(startDate).add(1, 'days').toDate();
          if (startDate >= endDate) {
            $scope[endModel](newEndModelMinDate);
          }
          $scope.rangeEndDatePickerOptions.minDate = newEndModelMinDate;
        };


        $scope.rangeEndSet = function (startModel, endModel) {
          var startDate = $scope.bookingPriceRuleForm[startModel].$viewValue;
          var endDate = $scope.bookingPriceRuleForm[endModel].$viewValue;
          var newStartModelMinDate = moment(startDate).add(-1, 'days').toDate();
          if (startDate >= endDate) {
            $scope[startModel](newStartModelMinDate);
          }
        };*/


/*        $scope.toggle = function ($event, element) {
          if (typeof $scope.datePickerStatus === "undefined") {
            $scope.datePickerStatus = {}
          }
          if (typeof $scope.datePickerStatus[element] === "undefined") {
            $scope.datePickerStatus[element] = false
          }
          $event.preventDefault();
          $event.stopPropagation();
          $scope.datePickerStatus[element] = !$scope.datePickerStatus[element];
          angular.element('#' + element).datepicker($scope.datePickerStatus[element] ? 'show' : 'hide')
        };*/




/*        //We take the Entry Date as the beginning of the day for the given timezone
        var _contractEntryDate = _contractDateTimeRangeCondition.start && _contractDateTimeRangeCondition.timezone ? moment(moment(_contractDateTimeRangeCondition.start).utcOffset(lookupTimezones[_contractDateTimeRangeCondition.timezone].offset).format(DATE_TIME_FORMAT_NO_OFFSET)).toDate() : null;
        $scope.contractEntryDate = function (newValue) {
          if (angular.isDefined(newValue)) {
            _contractEntryDate = newValue;
            _contractDateTimeRangeCondition.start = _contractEntryDate ? convertToUTC(_contractEntryDate, $scope.contractDateTimezone.offset).format(DATE_TIME_FORMAT) : null;
            bookingPriceRule.addCondition(_contractDateTimeRangeCondition);
          }
          return _contractEntryDate;
        };

        //We take the Entry Date as the beginning of the day for the given timezone converted to the user's current timezone for it all to work accordingly, therefore, a Day 15 in timezone A which is
        //Day 14 in the users default timezone, becomes Day 15 in timezone A.
        var _contractExitDate = _contractDateTimeRangeCondition.end && _contractDateTimeRangeCondition.timezone ? moment(moment(_contractDateTimeRangeCondition.end).utcOffset(lookupTimezones[_contractDateTimeRangeCondition.timezone].offset).format(DATE_TIME_FORMAT_NO_OFFSET)).toDate() : null;
        $scope.contractExitDate = function (newValue) {
          if (angular.isDefined(newValue)) {
            _contractExitDate = moment(newValue).add(1, 'days').add(-1, 'ms').toDate();
            _contractDateTimeRangeCondition.end = _contractExitDate ? convertToUTC(_contractExitDate, $scope.contractDateTimezone.offset).format(DATE_TIME_FORMAT) : null;
            bookingPriceRule.addCondition(_contractDateTimeRangeCondition);
          }
          return _contractExitDate;
        };

        $scope.timezones = TIMEZONES;
        $scope.contractDateTimezone = _contractDateTimeRangeCondition.timezone ? getTimezoneByValue(_contractDateTimeRangeCondition.timezone, TIMEZONES) : defaultTimezone.timezone;
        $scope.contractDateTimezoneSetter = function (value) {
          _contractDateTimeRangeCondition.timezone = value.value;
          if (_contractDateTimeRangeCondition.start) {
            _contractDateTimeRangeCondition.start = convertToUTC($scope.contractEntryDate(), $scope.contractDateTimezone.offset).format(DATE_TIME_FORMAT);
          }
          if (_contractDateTimeRangeCondition.end) {
            _contractDateTimeRangeCondition.end = convertToUTC($scope.contractExitDate(), $scope.contractDateTimezone.offset).format(DATE_TIME_FORMAT);
          }
          bookingPriceRule.addCondition(_contractDateTimeRangeCondition);
        };*/


        function getTimezoneForCondition(condition,timezones){
          return condition.timezone ? getTimezoneByValue(condition.timezone, timezones) : getTimezoneByValue(defaultTimezone, timezones);
        }

        function getDateFromCondition(condition,type,defaultTimezone){
          return condition[type] && condition.timezone ? readDateTime(condition[type],condition.timezone,defaultTimezone) :null;
        }

        function writeDateTime(dateObj,timezoneIdentifier){
          // As the DatePickers only give Dates in the browsers timezone, I must
          // strip the timezone part from the date string and concatenate the selected one
          var dateStringStrippedOffset=moment(dateObj).format(DATE_TIME_FORMAT_NO_OFFSET);
          return moment.tz(dateStringStrippedOffset,timezoneIdentifier).format(DATE_TIME_FORMAT);
        }


        function readDateTime(dateString,timezoneIdentifier,userTimezoneIdentifier){
          //This moment is converted from UTC to the rule stored Timezone
          var momentInOriginalTimezone=moment(dateString).tz(timezoneIdentifier);
          //Using to array we strip the moment's timezone, and the format it with the browsers timezone,
          //we must do this because pickers only take dates in the user's current timezone.
          return moment.tz(momentInOriginalTimezone.toArray(),userTimezoneIdentifier).toDate();
        }

        // Picker Config
        $scope.showMeridian = false;
        $scope.dateOptions = {
        };
        $scope.hourStep = 1;
        $scope.minuteStep = 15;
        $scope.timeOptions = {
          hourStep: [1, 2, 3],
          minuteStep: [1, 5, 10, 15, 25, 30]
        };
        //End Picker COnfig

        var _contractDateTimeRangeCondition = {
          id: null,
          start: null,
          end: null,
          timezone: defaultTimezone,
          conditionType: {},
          type: CONDITION_CLASS.DATE_TIME_RANGE
        };
        _contractDateTimeRangeCondition.conditionType[CONDITION_TYPE.CONTRACT] = true;

        if (conditions[CONDITION_CLASS.DATE_TIME_RANGE]) {
          for (var i = 0; i < conditions[CONDITION_CLASS.DATE_TIME_RANGE].length; i++) {
            if (conditions[CONDITION_CLASS.DATE_TIME_RANGE][i].conditionType[CONDITION_TYPE.CONTRACT]) {
              _contractDateTimeRangeCondition = conditions[CONDITION_CLASS.DATE_TIME_RANGE][i];
              break;
            }
          }
        }


        //We take the Entry Date as the beginning of the day for the given timezone converted to the user's current timezone for it all to work accordingly, therefore, a Day 15 in timezone A which is
        //Day 14 in the users default timezone, becomes Day 15 in timezone A.
        $scope.contractEntryDate = getDateFromCondition(_contractDateTimeRangeCondition,"start",defaultTimezone);


        //We take the Entry Date as the beginning of the day for the given timezone converted to the user's current timezone for it all to work accordingly, therefore, a Day 15 in timezone A which is
        //Day 14 in the users default timezone, becomes Day 15 in timezone A.
        $scope.contractExitDate = getDateFromCondition(_contractDateTimeRangeCondition,"end",defaultTimezone);

        $scope.contractDateTimezone = getTimezoneForCondition(_contractDateTimeRangeCondition, $scope.timezones) ;





        /******************END CONTRACT_DATE CONDITION GETTER SETTER***************************************/

        /********************* CONTRACT_HOUR_RANGE CONDITION GETTER SETTER***************************************/


        var _contractHourRangeCondition = {
          id: null,
          start: null,
          end: null,
          timezone: defaultTimezone,
          conditionType: {},
          type: CONDITION_CLASS.HOUR_RANGE
        };
        _contractHourRangeCondition.conditionType[CONDITION_TYPE.CONTRACT] = true;

        if (conditions[CONDITION_CLASS.HOUR_RANGE]) {
          for (var i = 0; i < conditions[CONDITION_CLASS.HOUR_RANGE].length; i++) {
            if (conditions[CONDITION_CLASS.HOUR_RANGE][i].conditionType[CONDITION_TYPE.CONTRACT]) {
              _contractHourRangeCondition = conditions[CONDITION_CLASS.HOUR_RANGE][i];
              break;
            }
          }
        }


        $scope.contractHourRangeTimezone = getTimezoneForCondition(_contractHourRangeCondition, $scope.timezones) ;

        /******************END CONTRACT_HOUR_RANGE CONDITION GETTER SETTER***************************************/


        /********************* CONTRACT WEEKDAY CONDITION GETTER SETTER***************************************/
        /*
         {
         "days": [
         "MONDAY",
         "FRIDAY",
         "TUESDAY"
         ],
         "id": 1,
         "conditionType": {
         "CONTRACT": true,
         "INCLUDE": true
         },
         "type": "WeekDayCondition"
         }
         */
        $scope.days = {};
        $scope.weekDays = WEEKDAYS;
        $scope.checkAll = function (property) {
          /*Emptying array to keep reference*/
          while ($scope.days[property].length) {
            $scope.days[property].pop();
          }
          $scope.weekDays.map(function (item) {
            $scope.days[property].push(item);
          });
          if (property.indexOf('contract') >= 0) {
            bookingPriceRule.addCondition(_contractWeekDayCondition);
          } else {
            bookingPriceRule.addCondition(_stayWeekDayCondition);
          }
        };
        $scope.uncheckAll = function (property) {
          /*Emptying array to keep reference*/
          while ($scope.days[property].length) {
            $scope.days[property].pop();
          }
          bookingPriceRule.addCondition(_contractWeekDayCondition);
          if (property.indexOf('contract') >= 0) {
            bookingPriceRule.addCondition(_contractWeekDayCondition);
          } else {
            bookingPriceRule.addCondition(_stayWeekDayCondition);
          }
        };

        var _contractWeekDayCondition = {
          id: null,
          days: [],
          conditionType: {},
          type: CONDITION_CLASS.WEEK_DAY
        };
        _contractWeekDayCondition.conditionType[CONDITION_TYPE.CONTRACT] = true;
        _contractWeekDayCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;

        if (conditions[CONDITION_CLASS.WEEK_DAY]) {
          for (var i = 0; i < conditions[CONDITION_CLASS.WEEK_DAY].length; i++) {
            if (conditions[CONDITION_CLASS.WEEK_DAY][i].conditionType[CONDITION_TYPE.CONTRACT]) {
              _contractWeekDayCondition = conditions[CONDITION_CLASS.WEEK_DAY][i];
              break;
            }
          }
        }

        $scope.days.contractWeekDaysConditionDays = _contractWeekDayCondition.days;
        $scope.$watch("days.contractWeekDaysConditionDays.length", function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          bookingPriceRule.addCondition(_contractWeekDayCondition);
        });
        /******************END CONTRACT WEEKDAY CONDITION GETTER SETTER***************************************/

        /********************* STAY WEEKDAY CONDITION GETTER SETTER***************************************/
        var _stayWeekDayCondition = {
          id: null,
          days: [],
          conditionType: {},
          type: CONDITION_CLASS.WEEK_DAY
        };
        _stayWeekDayCondition.conditionType[CONDITION_TYPE.STAY] = true;
        _stayWeekDayCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;
        if (conditions[CONDITION_CLASS.WEEK_DAY]) {
          for (var i = 0; i < conditions[CONDITION_CLASS.WEEK_DAY].length; i++) {
            if (conditions[CONDITION_CLASS.WEEK_DAY][i].conditionType[CONDITION_TYPE.STAY]) {
              _stayWeekDayCondition = conditions[CONDITION_CLASS.WEEK_DAY][i];
              break;
            }
          }
        }
        $scope.days.stayWeekDaysConditionDays = _stayWeekDayCondition.days;
        $scope.$watch("days.stayWeekDaysConditionDays.length", function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          bookingPriceRule.addCondition(_stayWeekDayCondition);
        });

        /******************END STAY WEEKDAY CONDITION GETTER SETTER***************************************/


        /********************* STAY_DATE CONDITION GETTER SETTER***************************************/

        var _stayDateTimeRangeCondition = {
          id: null,
          start: null,
          end: null,
          timezone: defaultTimezone,
          conditionType: {},
          type: CONDITION_CLASS.DATE_TIME_RANGE
        };
        _stayDateTimeRangeCondition.conditionType[CONDITION_TYPE.STAY] = true;

        if (conditions[CONDITION_CLASS.DATE_TIME_RANGE]) {
          for (var i = 0; i < conditions[CONDITION_CLASS.DATE_TIME_RANGE].length; i++) {
            if (conditions[CONDITION_CLASS.DATE_TIME_RANGE][i].conditionType[CONDITION_TYPE.STAY]) {
              _stayDateTimeRangeCondition = conditions[CONDITION_CLASS.DATE_TIME_RANGE][i];
              break;
            }
          }
        }

        $scope.stayEntryDate = getDateFromCondition(_stayDateTimeRangeCondition,"start",defaultTimezone);

        $scope.stayExitDate = getDateFromCondition(_stayDateTimeRangeCondition,"end",defaultTimezone);

        $scope.stayDateTimezone = getTimezoneForCondition(_stayDateTimeRangeCondition, $scope.timezones) ;

        /******************END CONTRACT_DATE CONDITION GETTER SETTER***************************************/

        /********************* CODE CONDITION GETTER SETTER***************************************/

        var _codeCondition = {
          id: null,
          supportedCodes: [],
          conditionType: {},
          type: CONDITION_CLASS.CODE
        };
        _codeCondition.conditionType[CONDITION_TYPE.EXACT] = true;

        if (conditions[CONDITION_CLASS.CODE]) {
          for (var i = 0; i < conditions[CONDITION_CLASS.CODE].length; i++) {
            _codeCondition = conditions[CONDITION_CLASS.CODE][i];
          }
        }
        $scope.code = function (newValue) {
          if (angular.isDefined(newValue)) {
            _codeCondition.supportedCodes = newValue.split(',');
            bookingPriceRule.addCondition(_codeCondition);
          }
          return _codeCondition.supportedCodes.join(',');
        };

        /******************END CODE CONDITION GETTER SETTER***************************************/




        var _tickerCondition = {
          id: null,
          dataValueHolderTickers: [],
          conditionType: {},
          type: CONDITION_CLASS.TICKER
        };
        _tickerCondition.conditionType[CONDITION_TYPE.EXACT] = true;
        _tickerCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;

        if (conditions[CONDITION_CLASS.TICKER]) {
          for (var i = 0; i < conditions[CONDITION_CLASS.TICKER].length; i++) {
            _tickerCondition = conditions[CONDITION_CLASS.TICKER][i];
            break;
          }
        }
        $scope.tickers = {
          dataValueHolderTickers: _tickerCondition.dataValueHolderTickers
        };

        $scope.$watch("tickers.dataValueHolderTickers.length", function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          bookingPriceRule.addCondition(_tickerCondition);
        });

        $scope.save = function () {
          if (bookingPriceRule.save()) {
            BookingPriceRuleManager.save(establishmentTicker, bookingPriceRule, function () {
              $location.path('bookingPriceRule/' + establishmentTicker + '/list');
            });
          }
        };

      }

      $timeout(function () {
        $timeout(function () {
          $(document).ready(function () {
            $("#checkallroomtypes").click(function () {
              $('#tiposhabitacionasociados input:checkbox').each(function () {
                var isChecked = $(this).prop('checked');
                if (!isChecked) {
                  $(this).trigger("click");
                }
              });
              return false;
            });
            $("#uncheckallroomtypes").click(function () {
              $('#tiposhabitacionasociados input:checkbox').each(function () {
                var isChecked = $(this).prop('checked');
                if (isChecked) {
                  $(this).trigger("click");
                }
              });
              return false;
            });
          });

          $(function () {

            $('.check').tooltip({title: 'marcar todos'});

            $('.check').click(function (evt) {
              evt.preventDefault();
              $('.checkHover').each(function (j, span) {
                var isChecked = $(span).parents('.checkbox').find('input:checkbox').prop('checked');
                if (!isChecked) {
                  $(span).parents('.checkbox').find('input:checkbox').trigger("click");
                }
              })
            });

            $('.check').hover(function () {
              var filter = $(this).attr('filter');
              $(this).addClass('checkHover')

              var clickedText = $(this).text();
              $(this).parents('#tiposhabitacionasociados').find('label > span').each(function (i, span) {
                if ($(span).attr('filter') == filter
                  && $(span).text() == clickedText) {
                  $(span).addClass('checkHover')
                }
              })
            }, function () {
              var filter = $(this).attr('filter');
              $(this).removeClass('checkHover')

              var clickedText = $(this).text();

              $(this).parents('#tiposhabitacionasociados').find('label > span').each(function (i, span) {
                if ($(span).attr('filter') == filter
                  && $(span).text() == clickedText) {
                  $(span).removeClass('checkHover')
                }
              })
            })
          });
        }, 0);
      }, 0);

    }]);
