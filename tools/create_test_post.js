var env = process.env.NODE_ENV || 'development',
  config = require('../config/global')[env],
  fs = require('fs'),
  async = require('async'),
  moment = require('moment'),
  request = require('request'),
  FeedParser = require('feedparser'),
  Iconv = require('iconv').Iconv,
  sanitizeHtml = require('sanitize-html'),
  mongoose = require('mongoose');

GLOBAL.config = config;

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

var User = mongoose.model('User'),
  Post = mongoose.model('Post'),
  Project = mongoose.model('Project'),
  Message = mongoose.model('Message'),
  Activity = mongoose.model('Activity'),
  Invitation = mongoose.model('Invitation'),
  Notification = mongoose.model('Notification');

function fetch(feed) {
  // Define our streams
  var req = request(feed, {
    timeout: 10000,
    pool: false,
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
      'accept': 'text/html,application/xhtml+xml'
    }
  });
  req.setMaxListeners(50);

  var feedparser = new FeedParser();

  // Define our handlers
  req.on('error', done);
  req.on('response', function(res) {

    if (res.statusCode != 200) {
      return this.emit('error', new Error('Bad status code'));
    }
    var charset = getParams(res.headers['content-type'] || '').charset;
    res = maybeTranslate(res, charset);
    // And boom goes the dynamite
    res.pipe(feedparser);
  });

  feedparser.on('error', done);
  feedparser.on('end', done);
  feedparser.on('readable', function() {
    var post;
    while (post = this.read()) {

      // if (moment(post.pubDate).isAfter(moment().startOf('day'))) {

          console.log("#############################");
          console.log(post);

          var m,
              images = [],
              rex = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;

          while ( m = rex.exec( post.description ) ) {
              images.push(m[1]);
          }

          var newPost = {
            content: sanitizeHtml(post.description, {
              allowedTags: [],
              allowedAttributes: []
            }),
            images: images,
            provider: feed,
            createDate: moment(post.pubDate)
          }

          async.waterfall([

            function count(callback) {

              async.parallel({

                user: function(callback) {
                  User.count(callback);
                },

                project: function(callback) {
                  Project.count(callback);
                }

              }, callback);
            },

            function relateInfo(count, callback) {

              async.parallel({

                user: function(callback) {
                  var random = Math.floor((Math.random() * count.user));
                  User.find().skip(random).limit(1).exec(callback)
                },

                project: function(callback) {
                  var random = Math.floor((Math.random() * 50));
                  Project.find()
                    .skip(random).limit(1).exec(callback)
                }

              }, callback);
            },

            function createPost(relate, callback) {

              // console.log(arguments)
              newPost.owner = relate.user[0];
              newPost.project = relate.project[0];
              Post.create(newPost, function(err, post) {
                if (err) callback(err);
                else callback(null, relate, post);
              });
            },

            function updateRelateInfo(relate, post, callback) {
              async.parallel({

                user: function(callback) {
                  relate.user[0].posts.push(post);
                  relate.user[0].save(callback);
                },

                group: function(callback) {
                  relate.project[0].posts.push(post);
                  relate.project[0].members.push(relate.user[0]);
                  relate.project[0].save(callback);
                }

              }, callback);
            }

          ], function(err, result) {
            console.log(result);
          });
      // }

    }
  });
}

function maybeTranslate (res, charset) {

  var iconv;
  // Use iconv if its not utf8 already.
  if (!iconv && charset && !/utf-*8/i.test(charset)) {
    try {
      iconv = new Iconv("GBK", 'utf-8');
      console.log('############################################');
      console.log('Converting from charset %s to utf-8', charset);
      console.log('############################################');
      iconv.on('error', done);
      // If we're using iconv, stream will be the output of iconv
      // otherwise it will remain the output of request
      res = res.pipe(iconv);
    } catch(err) {
      res.emit('error', err);
    }
  }
  return res;
}

function getParams(str) {
  var params = str.split(';').reduce(function (params, param) {
    var parts = param.split('=').map(function (part) { return part.trim(); });
    if (parts.length === 2) {
      params[parts[0]] = parts[1];
    }
    return params;
  }, {});
  return params;
}

function done(err) {
  if (err) {
    console.log(err, err.stack);
    // return process.exit(1);
  }
  // server.close();
  // process.exit();
}

[// 酷壳
'http://coolshell.cn/feed',
// 阮一峰的网络日志
'http://www.ruanyifeng.com/blog/atom.xml',
// 四火的唠叨
'http://www.raychase.net/feed',
// 云风的 BLOG
// 'http://blog.codingnow.com/atom.xml',
// 运维与架构
'http://www.nginx.cn/feed',
// ImportNew
'http://www.importnew.com/feed',
// Styling Android
'http://feeds.feedburner.com/StylingAndroid',
// 破船之家
'http://beyondvincent.com/atom.xml',
// 老罗的Android开发之旅
'http://blog.csdn.net/luoshengyang/rss/list',
// 代码家
'http://blog.daimajia.com/feed/',
// Android Notice
'http://androidniceties.tumblr.com/rss',
// sage42
'http://www.sage42.org/feed/',
// danlew -- Android小技巧
'http://blog.danlew.net/rss/',
// Job伯乐在线-Android频道
'http://blog.jobbole.com/category/android/feed/',
// Android-arsenal
'http://android-arsenal.com/rss.xml',
// Innost的专栏
'http://blog.csdn.net/innost/rss/list',
// WKLKEN PYTHON
'http://www.wklken.me/feed.xml',
// Hellsoft
'http://www.hellsoft.se/feed/',
// 云在千锋
'http://blog.chengyunfeng.com/?feed=rss2',
// Chris Banes
'https://chris.banes.me/rss/',
// Android Weekly
'http://us2.campaign-archive1.com/feed?u=887caf4f48db76fd91e20a06d&id=4eb677ad19',
// Android Developer Weekly
'http://androidweekly.cn/author/inferjay/rss/',
// Android Design Patterns
'http://www.androiddesignpatterns.com/feed.atom',
// inovex
'https://blog.inovex.de/feed/',
// Android Developers Blog
'http://feeds.feedburner.com/blogspot/hsDu',
// Raizlabs
'http://www.raizlabs.com/dev/feed/',
// Squareup
'http://feeds.feedburner.com/corner-squareup-com',
// trickyandroid
'http://trickyandroid.com/rss/',
// 鸟哥 惠新宸
'http://www.laruence.com/feed/',
// Fenng
'http://dbanotes.net/feed/',
// MacTalk-池建强的随想录
'http://macshuo.com/?feed=rss2',
// 少数派 - 数字生活传道者
'http://sspai.com/feed',
// 谷奥 :喜欢Google的必备。质量很高。
'http://www.guao.hk/feed',
// V2EX = way to explore :V2EX 是一个关于分享和探索的地方
'http://www.v2ex.com/index.xml',

].forEach(function(url, index){
    fetch(url);
})
