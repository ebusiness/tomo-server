angular.module('tripod')
  .controller('UserStatisticsController', ['StatisticService', 'user', function (StatisticService, user) {

    var self = this;

    StatisticService.query({user: user.id}, function(data){

      // prepare chart labels
      var iteDate = moment(data[0].date);

      self.labels = [];
      while (!iteDate.isSame(new Date(), 'day')) {
        self.labels.push(iteDate.format("YYYY/MM/DD"));
        iteDate.add(1, 'days');
      }

      // prepare chart series
      var groupedData = _.groupBy(data, 'type');
      self.series = _.keys(groupedData);

      // prepare chart data
      self.data = [];
      _.forEach(self.series, function(serie) {

        var subset = [];
        var serieData = groupedData[serie];
        var tempDate = moment(data[0].date);

        while (!tempDate.isSame(new Date(), 'day')) {

          var realData = _.find(serieData, {date: tempDate.format("YYYY-MM-DD")});

          if (realData)
            subset.push(realData.count);
          else
            subset.push(0);

          tempDate.add(1, 'days');
        }

        self.data.push(subset);
      });
    });

  }]);
