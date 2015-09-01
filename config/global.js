var path = require('path'),
  rootPath = path.normalize(__dirname + '/..');

module.exports = {

  test: {
    root: rootPath,
    app: {
      name: 'Tomo [TEST]',
      env: 'test',
      port: 80,
      userHost: 'tomo.localhost',
      adminHost: 'admin.localhost'
    },
    mongodb: {
      host: 'mongodb://localhost/tomo_test',
    },
    redis: {
      host: 'localhost',
      port: '6379'
    },
    mail: {
      service: '',
      auth: {
        user: '',
        pass: ''
      }
    }
  },

  development: {
    root: rootPath,
    app: {
      name: 'Tomo [DEV]',
      env: 'development',
      port: 81,
      userHost: 'tomo.localhost',
      adminHost: 'admin.localhost'
    },
    mongodb: {
      host: 'mongodb://localhost/tomo_dev'
    },
    redis: {
      host: 'localhost',
      port: '6379'
    },
    mail: {
      host: '',
      auth: {
        user: '',
        pass: ''
      }
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'Tomo',
      env: 'production',
      port: 8080,
      userHost: 'tomo.e-business.co.jp',
      adminHost: 'admin.e-business.co.jp'
    },
    mongodb: {
      host: 'mongodb://localhost/tomo'
    },
    redis: {
      host: 'localhost',
      port: '6379'
    },
    mail: {
      host: '',
      auth: {
        user: '',
        pass: ''
      }
    }
  }

};
