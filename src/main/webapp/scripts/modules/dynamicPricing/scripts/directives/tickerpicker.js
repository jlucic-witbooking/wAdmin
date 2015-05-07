'use strict';

/**
 * @ngdoc directive
 * @name bprApp.directive:tickerPicker
 * @description
 * # tickerPicker
 */
angular.module('bprApp')
  .directive('tickerPicker', function ($timeout) {
    return {
      restrict: 'AE',
      scope:{
        "model":"=",
        "tickerList":"="
      },
      template: function(elem, attrs) {
        var strVar="";
        strVar += "<div class=\"control-group\">";
        strVar += "    <div class=\"controls\">";
        strVar += "      <div class=\"controles\">";
        strVar += "        <a id=\"checkallroomtypes\" ng-click=\"checkAllTickers()\"><span>{{'trans.selectAll' | translate}}<\/span><\/a>&nbsp;&nbsp;|&nbsp;&nbsp;";
        strVar += "        <a id=\"uncheckallroomtypes\"";
        strVar += "           ng-click=\"uncheckAllTickers()\"><span>{{'trans.unselectAll' | translate}}<\/span><\/a>";
        strVar += "      <\/div>";
        strVar += "      <div id=\"tiposhabitacionasociados\">";
        strVar += "        <div ng-repeat=\"ticker in tickerList\">";
        strVar += "          <div class=\"input checkbox\">";
        strVar += "            <input type=\"checkbox\" checklist-model=\"model\" id=\"t_{{ticker.ticker}}\"";
        strVar += "                   checklist-value=\"ticker.ticker\">";
        strVar += "            <label for=\"t_{{ticker.ticker}}\">";
        strVar += "              <span filter=\"0\" class=\"check\">{{ticker.nombre}}<\/span> \/";
        strVar += "              <span filter=\"1\" class=\"check\">{{ticker.configuracion}}<\/span>,";
        strVar += "              <span filter=\"2\" class=\"check\">{{ticker.pension}}<\/span>,";
        strVar += "              <span filter=\"3\" class=\"check\">{{ticker.condicion}}<\/span>";
        strVar += "              <span>({{ticker.ticker}})<\/span>";
        strVar += "            <\/label>&nbsp;<i class=\"icon-info-sign\" title=\"{{ticker.ticker}}\"><\/i>";
        strVar += "          <\/div>";
        strVar += "        <\/div>";
        strVar += "      <\/div>";
        strVar += "    <\/div>";
        strVar += "  <\/div>";
        return strVar;
      },
      link: function postLink(scope, element, attrs) {

        scope.uncheckAllTickers = function () {
          while (scope.model.length>0) {
            scope.model.pop();
          }
        };

        scope.checkAllTickers = function () {
          scope.uncheckAllTickers();
          for (var index in  scope.tickerList){
            if (scope.tickerList.hasOwnProperty(index)){
              scope.model.push(scope.tickerList[index].ticker);
            }
          }
        };

        $timeout(function () {
          $(function () {
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

      }
    };
  });
