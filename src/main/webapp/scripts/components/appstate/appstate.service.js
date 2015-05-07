'use strict';

angular.module('adminApp')
    .service('AppState', function ($rootScope,EVENTS) {

        var _bookingEngine="hoteldemo.com.v6";

        this.setBookingEngine=function(bookingEngine){
            _bookingEngine=bookingEngine;
            $rootScope.$broadcast(EVENTS.CHANGED_BOOKING_ENGINE);
        };

        this.getBookingEngine=function(){
            return _bookingEngine;
        };

    });
