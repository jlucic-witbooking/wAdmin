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
    'DATE_TIME_FORMAT', 'TIMEZONES', 'DATE_TIME_FORMAT_NO_OFFSET', 'TIME_FORMAT', 'TIME_FORMAT_NO_OFFSET', 'WEEKDAYS', 'DATE_FORMAT', 'DEFAULT_LANGUAGE', '$window', '$location', '$timeout','timezoneDetection','$state',
        'DYNAMIC_PRICING_TEMPLATE_LOCATION',
    function ($scope, $filter, $routeParams, BookingPriceRuleManager, BookingPriceRule, COUNTRIES, CONDITION_TYPE, CONDITION_CLASS, DEFAULT_DATE_PICKER_SETTINGS, DATE_TIME_FORMAT,
              TIMEZONES, DATE_TIME_FORMAT_NO_OFFSET, TIME_FORMAT, TIME_FORMAT_NO_OFFSET, WEEKDAYS, DATE_FORMAT, DEFAULT_LANGUAGE, $window, $location, $timeout,timezoneDetection,$state,
        DYNAMIC_PRICING_TEMPLATE_LOCATION) {

      var establishmentTicker = $routeParams.establishmentTicker;
      var bookingPriceRuleID = $routeParams.id || null;
      var defaultTimezone = timezoneDetection.currentTimezone();
      $scope.DYNAMIC_PRICING_TEMPLATE_LOCATION=DYNAMIC_PRICING_TEMPLATE_LOCATION;
      $scope.tickerList = $window.tickerList;
      $scope.establishmentTicker = establishmentTicker;
      $scope.timezones = timezoneDetection.namesMap;

      $scope.$state = $state;

      // Picker Config
      $scope.showMeridian = false;
      $scope.dateOptions = {};
      $scope.dateOptions = {};
      $scope.hourStep = 1;
      $scope.minuteStep = 15;
      //End Picker COnfig


      if (bookingPriceRuleID) {
        BookingPriceRuleManager.get(establishmentTicker, bookingPriceRuleID).then(
          function (result) {
            initialize(result)
          }, function () {
            alert("Error Occured. Please try again later")
          });
      } else {
        initialize(null);
      }

      function Condition(type,subtype) {
        var newCondition = {
          id: null,
          conditionType: {},
          type: type,
          changed:false
        };
        if(subtype){
          newCondition.conditionType[subtype] = true;
        }
        if( type === CONDITION_CLASS.DATE_TIME_RANGE ||  type === CONDITION_CLASS.HOUR_RANGE){
          newCondition.start=null;
          newCondition.end=null;
          newCondition.timezone=defaultTimezone;
          newCondition.timezone=defaultTimezone;
          return newCondition;
        }else if ( type === CONDITION_CLASS.WEEK_DAY){
          newCondition.days = [];
        }else if ( type === CONDITION_CLASS.COUNTRY_OF_ORIGIN){
          newCondition.countries = [];
        }else if ( type === CONDITION_CLASS.CODE){
          newCondition.supportedCodes = [];
        }else if ( type === CONDITION_CLASS.TICKER){
          newCondition.dataValueHolderTickers = [];
        }
        return newCondition;
      }

      function getCondition(conditions,type,subtype) {
        if (conditions[type]) {
          var conditionsOfType = conditions[type];
          if(  type === CONDITION_CLASS.COUNTRY_OF_ORIGIN
            || type === CONDITION_CLASS.TICKER
            || type === CONDITION_CLASS.CODE ){
            return conditionsOfType[0];
          }
          if(subtype){
            for (var i = 0; i < conditionsOfType.length; i++) {
              if (conditionsOfType[i].conditionType[subtype]) {
                return conditionsOfType[i];
              }
            }
          }
        }
        return new Condition(type,subtype);
      }

      function getTimezoneByValue(value, timezones) {
        return timezones[value];
      }

      function getTimezoneForCondition(condition,timezones){
        return condition.timezone ? getTimezoneByValue(condition.timezone, timezones) : getTimezoneByValue(defaultTimezone, timezones);
      }

      function getDateFromCondition(condition,type,defaultTimezone,format){
        return condition[type] && condition.timezone ? readDateTime(condition[type],condition.timezone,defaultTimezone,format) :null;
      }


      function readDateTime(dateString,timezoneIdentifier,userTimezoneIdentifier,format){
        //This moment is converted from UTC to the rule stored Timezone
        //var momentInOriginalTimezone=null;
        //if(format){
        //  momentInOriginalTimezone=moment(dateString,format).tz(timezoneIdentifier);
        //}else{
        //  momentInOriginalTimezone=moment(dateString).tz(timezoneIdentifier);
        //}
        //Using to array we strip the moment's timezone, and the format it with the browsers timezone,
        //we must do this because pickers only take dates in the user's current timezone.
        //return moment.tz(momentInOriginalTimezone.toArray(),userTimezoneIdentifier).toDate();
        var dateStringToUTCStrippedOffset=null;
        if(format){
          dateStringToUTCStrippedOffset=moment(dateString,format).format("YYYY-MM-DDTHH:mm:ss.SSS");
        }else{
          dateStringToUTCStrippedOffset=moment(dateString).utc().format("YYYY-MM-DDTHH:mm:ss.SSS");
        }
        var currentBrowserTimezoneOffset=moment(new Date()).format("Z");
        var dateStringInBrowserTimezone=dateStringToUTCStrippedOffset+currentBrowserTimezoneOffset;
        return moment(dateStringInBrowserTimezone).toDate();
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


        /****************** PRICEVARIATION GETTER SETTER***************************************/
        $scope.priceVariation = Math.abs(bookingPriceRule.priceVariation) || null ;
        $scope.setPriceVariation=function(priceVariation){
          var sign=$scope.sign().id === "POSITIVE" ? 1 : -1;
          bookingPriceRule.priceVariation = priceVariation*sign;
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

        $scope.conditions=[];

        /********************* COUNTRIES CONDITION GETTER SETTER***************************************/

        $scope.countries = COUNTRIES;

        var getIncludedCountries = function (excludedCountries) {
          return setMinus(COUNTRIES, excludedCountries);
        };
        var _excludedCountries = [];

        var _countryCondition=getCondition(conditions,CONDITION_CLASS.COUNTRY_OF_ORIGIN)? getCondition(conditions,CONDITION_CLASS.COUNTRY_OF_ORIGIN) : null;
        _countryCondition.conditionType[CONDITION_TYPE.ALL] = true;

        $scope.conditions.push(_countryCondition);

        if (_countryCondition && _countryCondition.conditionType[CONDITION_TYPE.INCLUDE]) {
          _excludedCountries = getIncludedCountries(_countryCondition.countries);
        } else if (_countryCondition && _countryCondition.conditionType[CONDITION_TYPE.EXCLUDE]) {
          _excludedCountries = _countryCondition.countries;
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
          }
          return _excludedCountries;
        };

        /******************END COUNTRIES CONDITION GETTER SETTER***************************************/


        /********************* CONTRACT_DATE CONDITION GETTER SETTER***************************************/

        var _contractDateTimeRangeCondition= $scope.contractDateTimeRangeCondition = getCondition(conditions,CONDITION_CLASS.DATE_TIME_RANGE,CONDITION_TYPE.CONTRACT);
        //We take the Entry Date as the beginning of the day for the given timezone converted to the user's current timezone for it all to work accordingly, therefore, a Day 15 in timezone A which is
        //Day 14 in the users default timezone, becomes Day 15 in timezone A.
        _contractDateTimeRangeCondition.start= getDateFromCondition(_contractDateTimeRangeCondition,"start",defaultTimezone);

        //We take the Entry Date as the beginning of the day for the given timezone converted to the user's current timezone for it all to work accordingly, therefore, a Day 15 in timezone A which is
        //Day 14 in the users default timezone, becomes Day 15 in timezone A.
        _contractDateTimeRangeCondition.end = getDateFromCondition(_contractDateTimeRangeCondition,"end",defaultTimezone);

        $scope.conditions.push(_contractDateTimeRangeCondition);
        /******************END CONTRACT_DATE CONDITION GETTER SETTER***************************************/

        /********************* CONTRACT_HOUR_RANGE CONDITION GETTER SETTER***************************************/


        var _contractHourRangeCondition= $scope.contractHourRangeCondition = getCondition(conditions,CONDITION_CLASS.HOUR_RANGE,CONDITION_TYPE.CONTRACT);

        _contractHourRangeCondition.start=getDateFromCondition(_contractHourRangeCondition,"start",defaultTimezone,TIME_FORMAT_NO_OFFSET);
        if(!_contractHourRangeCondition.start){
          _contractHourRangeCondition.start = new Date();
          _contractHourRangeCondition.start.setHours(0,0);
        }

        _contractHourRangeCondition.end=getDateFromCondition(_contractHourRangeCondition,"end",defaultTimezone,TIME_FORMAT_NO_OFFSET);
        if(!_contractHourRangeCondition.end){
          _contractHourRangeCondition.end = new Date();
          _contractHourRangeCondition.end.setHours(0,0);
        }

        $scope.conditions.push(_contractHourRangeCondition);


        /******************END CONTRACT_HOUR_RANGE CONDITION GETTER SETTER***************************************/


        /********************* CONTRACT WEEKDAY CONDITION GETTER SETTER***************************************/
        $scope.days = {};
        $scope.weekDays = WEEKDAYS;

        var _contractWeekDayCondition=getCondition(conditions,CONDITION_CLASS.WEEK_DAY,CONDITION_TYPE.CONTRACT);
        _contractWeekDayCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;

        $scope.conditions.push(_contractWeekDayCondition);

        $scope.days.contractWeekDaysConditionDays = _contractWeekDayCondition.days;

        /******************END CONTRACT WEEKDAY CONDITION GETTER SETTER***************************************/

        /********************* STAY WEEKDAY CONDITION GETTER SETTER***************************************/

        var _stayWeekDayCondition=getCondition(conditions,CONDITION_CLASS.WEEK_DAY,CONDITION_TYPE.STAY);
        _stayWeekDayCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;
        $scope.conditions.push(_stayWeekDayCondition);

        $scope.days.stayWeekDaysConditionDays = _stayWeekDayCondition.days;

        /******************END STAY WEEKDAY CONDITION GETTER SETTER***************************************/


        /********************* STAY_DATE CONDITION GETTER SETTER***************************************/
        var _stayDateTimeRangeCondition= $scope.stayDateTimeRangeCondition = getCondition(conditions,CONDITION_CLASS.DATE_TIME_RANGE,CONDITION_TYPE.STAY);
        _stayDateTimeRangeCondition.start= getDateFromCondition(_stayDateTimeRangeCondition,"start",defaultTimezone);
        _stayDateTimeRangeCondition.end = getDateFromCondition(_stayDateTimeRangeCondition,"end",defaultTimezone);
        $scope.conditions.push(_stayDateTimeRangeCondition);
        /******************END CONTRACT_DATE CONDITION GETTER SETTER***************************************/

        /********************* CODE CONDITION GETTER SETTER***************************************/

        var _codeCondition=getCondition(conditions,CONDITION_CLASS.CODE);
        _codeCondition.conditionType[CONDITION_TYPE.EXACT] = true;
        $scope.conditions.push(_codeCondition);

        $scope.code = function (newValue) {
          if (angular.isDefined(newValue)) {
            _codeCondition.supportedCodes = newValue.split(',');
          }
          return _codeCondition.supportedCodes.join(',');
        };

        /******************END CODE CONDITION GETTER SETTER***************************************/

        /******************START TICKER CONDITION GETTER SETTER***************************************/

        var _tickerCondition=getCondition(conditions,CONDITION_CLASS.TICKER);
        _tickerCondition.conditionType[CONDITION_TYPE.EXACT] = true;
        _tickerCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;
        $scope.conditions.push(_tickerCondition);

        $scope.tickers = { dataValueHolderTickers: _tickerCondition.dataValueHolderTickers };

        /******************END TICKER CONDITION GETTER SETTER***************************************/

        $scope.save = function () {
          bookingPriceRule.conditions=[];
          bookingPriceRule.clearConditions();
          $scope.conditions.forEach(function(item){
            bookingPriceRule.addCondition(item);
          });

          if (bookingPriceRule.save()) {
            BookingPriceRuleManager.save(establishmentTicker, bookingPriceRule, function () {
              $state.go('ruleList', {establishmentTicker:establishmentTicker});
              //$location.path('bookingPriceRule/' + establishmentTicker + '/list');
            });
          }

        };
      }

    }]);
