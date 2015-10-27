var path = require('path'),
  http = require('http'),
  express = require('express'),
  favicon = require('serve-favicon'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  // sassMiddleware = require('node-sass-middleware'),
  RedisStore = require('connect-redis')(session),
  errorhandler = require('errorhandler');

module.exports = function(config) {

  var app = express();

  // View directory
  app.set('views', path.join(config.root, '/app-admin/views'));

  // View engine is jade
  app.set('view engine', 'jade');

  // Fav-icon
  // app.use(favicon(path.join(config.root, '/public/favicon.ico')));

  // Compress all requests
  app.use(compression())

  // Logger use express-logger in production, otherwise use morgan
  if ('production' !== config.app.env)
    app.use(require('morgan')('dev'));
  else
    app.use(require('express-logger')({
      path: config.root + '/log-admin/requests.log'
    }));

  // Override request method
  app.use(methodOverride());

  // Redis session storage
  var redisStore = new RedisStore({
    host:config.redis.host,
    port:config.redis.port
  });

  // session
  app.use(session({
    store: redisStore,
    resave: true,
    saveUninitialized: true,
    secret: 'uwotm8'
  }));

  // Parse application/json
  app.use(bodyParser.json());

  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded());

  // Parse cookie before session
  app.use(cookieParser('cookie secret sauce'));

  /* TODO: CSRF support */

  // // Sass Middleware
  // if ('production' !== config.app.env)
  //   app.use(sassMiddleware({
  //     src: path.join(config.root, 'public'),
  //     dest: path.join(config.root, 'public'),
  //     debug: true
  //   }));

  // Public folder
  if ('production' !== config.app.env)
    app.use(express.static(path.join(config.root, 'public')));
  else
    app.use(express.static(path.join(config.root, 'public-build')));

  // Error handler, not linked in production
  if ('production' !== config.app.env) {
    app.use(errorhandler());
  }

  // Routes
  require('./routes')(app, config);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      console.log(err);
      res.status(err.status || 500).end();
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).end();
  });

  return app;
};
