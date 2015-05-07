'use strict';

/**
 * @ngdoc service
 * @name bprApp.BookingPriceRuleModel
 * @description
 * # BookingPriceRuleModel
 * Factory in the bprApp.
 */
angular.module('bprApp')
  .factory('BookingPriceRule',['CONDITION_CLASS','CONDITION_TYPE','COUNTRIES','DATE_TIME_FORMAT_NO_OFFSET','DATE_TIME_FORMAT','TIMEZONE_OFFSET','TIME_FORMAT_NO_OFFSET',
    function(CONDITION_CLASS,CONDITION_TYPE,COUNTRIES,DATE_TIME_FORMAT_NO_OFFSET,DATE_TIME_FORMAT,TIMEZONE_OFFSET,TIME_FORMAT_NO_OFFSET) {

    function BookingPriceRule(bookingPriceRuleData) {
      var _conditions={};
      this.getConditionsMap=function(){
        return _conditions;
      };
      this.setConditionsMap=function(conditions){
        _conditions=conditions;
      };

      this.writeDateTime=function(dateObj,timezoneIdentifier){
        var dateStringStrippedOffset = moment(dateObj).format(DATE_TIME_FORMAT_NO_OFFSET);
        var offset=moment.tz(new Date(),timezoneIdentifier).format(TIMEZONE_OFFSET);
        return dateStringStrippedOffset+offset;
      };

      this.writeTime=function(dateObj,timezoneIdentifier){
        return moment(dateObj).format(TIME_FORMAT_NO_OFFSET);
      };


      if (bookingPriceRuleData) {
        this.setData(bookingPriceRuleData);
      }
    }

    BookingPriceRule.prototype = {
      setData: function(bookingPriceRuleData) {
        angular.extend(this, bookingPriceRuleData);
        this.conditions=this.conditions ? this.conditions: [];
        var conditionList=this.conditions;
        this.setConditionsMap({});
        var conditions=this.getConditionsMap();
        for (var i=0;i<conditionList.length;i++){
          if(!conditions.hasOwnProperty(conditionList[i].type)){
            conditions[conditionList[i].type]=[];
          }
          conditions[conditionList[i].type].push(conditionList[i]);
        }
      },
      isValid:function(){
        return true;
      },
      clearConditions:function(condition){
        this.setConditionsMap({});
      },
      addCondition:function(originalCondition){
        var condition=angular.copy(originalCondition);

        var validation=this.isConditionValid(condition);

        if(validation.error){
          return validation;
        }

        var ruleConditions=this.getConditionsMap();

        if(!ruleConditions.hasOwnProperty(condition.type)){
          ruleConditions[condition.type]=[];
        }

        if(ruleConditions.hasOwnProperty(condition.type)){

          if(condition.type===CONDITION_CLASS.DATE_TIME_RANGE){
            condition.start = this.writeDateTime(condition.start,"UTC",condition.timezone);
            condition.end = this.writeDateTime(condition.end,"UTC",condition.timezone);
          }

          if(condition.type===CONDITION_CLASS.HOUR_RANGE){
            condition.start = this.writeTime(condition.start,"UTC",condition.timezone);
            condition.end = this.writeTime(condition.end,"UTC",condition.timezone);
          }

          ruleConditions[condition.type].push(condition);

          return true;
        }

        return false;
      },
      isConditionValid:function(condition){
        if( !condition.hasOwnProperty("id") || !condition.hasOwnProperty("conditionType") || !condition.hasOwnProperty("type") ){
          return {error:true, message:"Invalid Condition Object", code:"INVALID"};
        }
        if(condition.type===CONDITION_CLASS.COUNTRY_OF_ORIGIN){
          if (!condition.hasOwnProperty("countries") || Object.prototype.toString.call( condition.countries ) !== '[object Array]'  ){
            return {error:true, message:"Invalid Country Condition", code:"INVALID_COUNTRY_CONDITION"};
          }
          if (condition.countries.length===0 && condition.conditionType[CONDITION_TYPE.INCLUDE]) {
            return {error:true, message:"At least one country must be included", code:"NO_COUNTRY_POSSIBLE"};
          }
          if (condition.countries.length===COUNTRIES.length && condition.conditionType[CONDITION_TYPE.EXCLUDE]) {
            return {error:true, message:"At least one country must be included", code:"NO_COUNTRY_POSSIBLE"};
          }
        }else if(condition.type===CONDITION_CLASS.DATE_TIME_RANGE ){
          if (!condition.hasOwnProperty("start") || !condition.hasOwnProperty("end") || !condition.start || !condition.end ){
            return {error:true, message:"Invalid Range Condition", code:"INVALID_RANGE_CONDITION"};
          }
        }else if(condition.type===CONDITION_CLASS.WEEK_DAY){
          if (!condition.hasOwnProperty("days") || Object.prototype.toString.call( condition.days ) !== '[object Array]'  ){
            return {error:true, message:"Invalid WeekDay Condition", code:"INVALID_WEEK_DAY_CONDITION"};
          }
          if (condition.days.length===0 && condition.conditionType[CONDITION_TYPE.INCLUDE]) {
            return {error:true, message:"At least one weekday must be included", code:"NO_COUNTRY_POSSIBLE"};
          }
        }else if(condition.type===CONDITION_CLASS.CODE){

          if (!condition.supportedCodes || condition.supportedCodes.length===0){
            return {error:true, message:"At least one code must be included", code:"INVALID_CODE"};
          }

        }else if(condition.type===CONDITION_CLASS.TICKER){

          if (!condition.dataValueHolderTickers || condition.dataValueHolderTickers.length===0){
            return {error:true, message:"At least one ticker must be included", code:"INVALID_TICKERS"};
          }

        }else if(condition.type===CONDITION_CLASS.HOUR_RANGE){

          if (!condition.start || !condition.end){
            return {error:true, message:"trans.invalidRange", code:"INVALID_RANGE"};
          }

          if (condition.start.getHours()===0 &&  condition.start.getMinutes()===0 && condition.end.getHours()===0 &&  condition.end.getMinutes()===0){
            return {error:true, message:"trans.invalidRange", code:"INVALID_RANGE"};
          }

        }else{
          return {error:true, message:"Invalid Condition Type", code:"INVALID_TYPE"};
        }
        return {valid:true};
      },
      save:function(conditionsMap){

        this.priceVariation=parseFloat(this.priceVariation);
        if(!(typeof this.priceVariation == 'number' && !isNaN(this.priceVariation - this.priceVariation) )){
          alert("Invalid Price Variation");
          return false;
        }

        if(!conditionsMap){
          conditionsMap=this.getConditionsMap();
        }
        if(!this.conditions || Object.prototype.toString.call( this.conditions ) !== '[object Array]' ){
          this.conditions=[];
        }
        var formula = "";
        var conditions = this.conditions = [];
        var c=0;
        for (var type in conditionsMap) {
          if( conditionsMap.hasOwnProperty( type ) ) {
            conditionsMap[type].map(function(condition){
              c++;
              condition.id=c;
              formula+="c"+condition.id+" && ";
              conditions.push(condition);
            });
          }
        }
        if(!conditions.length>0){
          return false;
        }
        formula=formula.substring(0,formula.length-3);
        this.formula=formula;
        return true;
      }
    };
    return BookingPriceRule;
  }]);
