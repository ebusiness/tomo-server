angular.module('tripod')
  .controller('HomeController', [
    '$mdDialog',
    'StatisticService',
    'activityFilter',
    'ActivityValue',
    function (
      $mdDialog,
      StatisticService,
      activityFilter,
      ActivityValue
    ) {

    var self = this;
    var defaultParameters = {
      types: ['post-new', 'post-commented'],
      before: moment().valueOf(),
      after: moment().subtract(1, 'months').valueOf()
    };

    self.accounts = {colours:['#4CAF50', '#C8E6C9']};
    self.users = {colours:['#F44336', '#FFCDD2']};
    self.posts = {colours:['#2196F3', '#BBDEFB']};
    self.groups = {colours:['#009688', '#B2DFDB']};
    self.messages = {colours:['#FF5722', '#FFCCBC']};
    self.reports = {colours:['#9C27B0', '#E1BEE7']};

    getStatistics({
      types: ['user-activated'],
      before: moment().valueOf(),
      after: moment().subtract(1, 'months').valueOf()
    }, self.accounts);

    getStatistics({
      types: ['friend-invited', 'friend-accepted'],
      before: moment().valueOf(),
      after: moment().subtract(1, 'months').valueOf()
    }, self.users);

    getStatistics({
      types: ['post-new', 'post-commented'],
      before: moment().valueOf(),
      after: moment().subtract(1, 'months').valueOf()
    }, self.posts);

    getStatistics({
      types: ['group-new', 'group-joined'],
      before: moment().valueOf(),
      after: moment().subtract(1, 'months').valueOf()
    }, self.groups);

    getStatistics({
      types: ['message-new'],
      before: moment().valueOf(),
      after: moment().subtract(1, 'months').valueOf()
    }, self.messages);

    getStatistics({
      types: ['post-reported', 'user-reported'],
      before: moment().valueOf(),
      after: moment().subtract(1, 'months').valueOf()
    }, self.reports);

    // self.showFilterOptions = function(event) {
    //   $mdDialog.show({
    //     controller: ['$mdDialog', DialogController],
    //     controllerAs: 'ctrl',
    //     templateUrl: '/admin/template/home.option.dialog.html',
    //     clickOutsideToClose: true,
    //     targetEvent: event
    //   }).then(function(parameters) {
    //     getStatistics(parameters);
    //   });
    // };
    //
    // function DialogController($mdDialog) {
    //
    //   this.activityTypes = ActivityValue;
    //   this.types = defaultParameters.types;
    //   this.today = new Date();
    //
    //   this.setOption = function() {
    //     $mdDialog.hide({
    //       types: this.types,
    //       before: this.before ? moment(this.before).valueOf() : null,
    //       after: this.after ? moment(this.after).valueOf() : null
    //     });
    //   };
    //
    //   this.cancel = function() {
    //     $mdDialog.cancel();
    //   };
    //
    //   this.toggle = function (item) {
    //     var idx = this.types.indexOf(item);
    //     if (idx > -1) this.types.splice(idx, 1);
    //     else this.types.push(item);
    //   };
    //
    //   this.exists = function (item) {
    //     return this.types.indexOf(item) > -1;
    //   };
    // };

    function getStatistics(parameters, result) {

      var parameters = parameters || defaultParameters;

      StatisticService.query(parameters, function(data){

        // prepare chart labels
        var iteDate = moment(parameters.after);

        result.labels = [];
        while (!iteDate.isSame(moment(parameters.before), 'day')) {
          result.labels.push(iteDate.format("MM/D"));
          iteDate.add(1, 'days');
        }

        // prepare chart series
        result.series = _.map(parameters.types, activityFilter);

        // prepare chart data
        result.data = [];
        var groupedData = _.groupBy(data, 'type');

        _.forEach(parameters.types, function(serie) {

          var subset = [];
          var serieData = groupedData[serie];
          var tempDate = moment(parameters.after);

          while (!tempDate.isSame(moment(parameters.before), 'day')) {

            var realData = _.find(serieData, {date: tempDate.format("YYYY-MM-DD")});

            if (realData)
              subset.push(realData.count);
            else
              subset.push(0);

            tempDate.add(1, 'days');
          }

          result.data.push(subset);
        });
      });
    };

    self.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

  }]);
