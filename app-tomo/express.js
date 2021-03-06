var path = require('path'),
  socket = require('socket.io'),
  // http = require('http').Server,
  // https = require('https').Server,
  express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  RedisStore = require('connect-redis')(session),
  errorhandler = require('errorhandler');

module.exports = function(config, server) {

  var app = express();
  // var server = http(app);
  // var server = https(config.ssl, app);
  var sio = socket(server);

  // View directory
  app.set('views', path.join(config.root, '/app-tomo/views'));

  // View engine is jade
  app.set('view engine', 'jade');

  // Compress all requests
  app.use(compression())

  // Logger use express-logger in production, otherwise use morgan
  if ('production' !== config.app.env)
    app.use(require('morgan')('dev'));
  else
    app.use(require('express-logger')({
      path: config.root + '/log/requests.log'
    }));

  // Override request method
  app.use(methodOverride());

  // Redis session storage
  var redisStore = new RedisStore({
    host:config.redis.host,
    port:config.redis.port
  });

  var sessionMiddleware = session({
    store: redisStore,
    resave: true,
    saveUninitialized: true,
    secret: 'uwotm8',
    cookie: {
      maxAge: 60 * 60 * 24 * 3 * 1000 // 3 days
    }
  });

  sio.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  sio.sockets.on('connection', function(socket) {
    if (socket.request.session) {
      socket.join(socket.request.session.userId);
    }
  });

  // session
  app.use(sessionMiddleware);

  // Parse application/json
  app.use(bodyParser.json());

  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded());

  // Parse cookie before session
  app.use(cookieParser('cookie secret sauce'));

  /* TODO: CSRF support */

  // Error handler, not linked in production
  if ('production' !== config.app.env) {
    app.use(errorhandler());
  }

  // Routes
  require('./routes')(app, config, sio);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  app.use(function(err, req, res, next) {
    // development error handler
    // will print stacktrace
    if (err && app.get('env') === 'development') {
      console.log("" + err);
    }
    // development/production error handler
    res.status(err.status || 500).end();
  });

  return app;
};
