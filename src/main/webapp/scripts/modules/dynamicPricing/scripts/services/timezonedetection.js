'use strict';

/**
 * @ngdoc service
 * @name bprApp.timezoneDetection
 * @description
 * # timezoneDetection
 * Service in the bprApp.
 */
angular.module('bprApp')
  .service('timezoneDetection', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var tzdetect = {
      names: moment.tz.names(),
      namesMap:moment.tz.names().reduce(function(obj, k) { obj[k] = k; return obj; }, {}),
      matches: function(base){
        var results = [], now = Date.now(), makekey = function(id){
          return [0, 4, 8, -5*12, 4-5*12, 8-5*12, 4-2*12, 8-2*12].map(function(months){
            var m = moment(now + months*30*24*60*60*1000);
            if (id) m.tz(id);
            // Compare using day of month, hour and minute (some timezones differ by 30 minutes)
            return m.format("DDHHmm");
          }).join(' ');
        }, lockey = makekey(base);
        tzdetect.names.forEach(function(id){
          if (makekey(id)===lockey) results.push(id);
        });
        return results;
      },
      currentTimezone:function(base){
        return this.matches(base)[0];
      }
    };

    return tzdetect;
  });
