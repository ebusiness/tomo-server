var env = process.env.NODE_ENV || 'development',
  config = require('../config/global')[env],
  fs = require('fs'),
  async = require('async'),
  moment = require('moment'),
  request = require('request'),
  mongoose = require('mongoose');

  // Connect to MongoDB
  mongoose.connect(config.mongodb.host);
  mongoose.connection.on('open', function() {
    if ('production' !== config.app.env) mongoose.set('debug', true);
    console.log("DataBase " + config.mongodb.host + " connected.");
  });

  // Load MongoDB models
  var models_path = config.root + '/models';
  fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
  });

var Group = mongoose.model('Group'),
  Station = mongoose.model('Station');

var stas = ['新宿','池袋','東京','横浜','渋谷','品川','新橋','大宮','秋葉原','川崎','北千住','高田馬場','上野','有楽町','立川','浜松町','大崎','田町','中野','蒲田','吉祥寺','恵比寿','船橋','五反田','西船橋','柏','武蔵小杉','町田','戸塚','国分寺','目黒','藤沢','日暮里','千葉','錦糸町','御茶ノ水','津田沼','大井町','松戸','西日暮里','神田','大船','大森','三鷹','四ツ谷','飯田橋','赤羽','荻窪','仙台','八王子']

function fetch() {

  stas.forEach(function(sta) {

    async.waterfall([

      function findStation(callback) {
        Station.findOne({name: sta}, callback);
      },

      function findGroup(station, callback) {
        Group.findOne()
          .where('name').equals(station.name)
          .where('station').equals(station.id)
          .where('type').equals('station')
          .exec(function(err, group) {
            if (err) next(err);
            else callback(null, station, group);
          });
      },

      function createGroupIfNeeded(station, group, callback) {

        if (!group) {
          Group.create({
            type: 'station',
            name: station.name,
            station: station.id,
            coordinate: station.coordinate
          }, callback);
        } else callback(null, group);
      }

    ], function(err, group) {
      console.log(group);
    });

  });

}

fetch();
