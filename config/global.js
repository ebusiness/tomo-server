var fs = require('fs'),
  path = require('path'),
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
    s3: {
        host: 'https://s3-ap-northeast-1.amazonaws.com',
        bucket: 'tomo-test'
    },
    ssl: {
        // key: fs.readFileSync(rootPath + '/resources/ssl/test/selink.pem'),
        // cert: fs.readFileSync(rootPath + '/resources/ssl/test/selink.crt')
    },
    apn: {
      key:  rootPath + '/resources/apn/production/key.pem',
      cert: rootPath + '/resources/apn/production/cert.pem',
      gateway: 'gateway.push.apple.com',
      port: 2195
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
    s3: {
        host: 'https://s3-ap-northeast-1.amazonaws.com',
        bucket: 'tomo-dev'
    },
    ssl: {
        // key: fs.readFileSync(rootPath + '/resources/ssl/development/selink.pem'),
        // cert: fs.readFileSync(rootPath + '/resources/ssl/development/selink.crt')
    },
    apn: {
      cert: rootPath + '/resources/apn/development/cert.pem',
      key:  rootPath + '/resources/apn/development/key.pem',
      gateway: 'gateway.sandbox.push.apple.com',
      port: 2195
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
    s3: {
        host: 'https://s3-ap-northeast-1.amazonaws.com',
        bucket: 'tomo'
    },
    ssl: {
        // key: fs.readFileSync(rootPath + '/resources/ssl/production/selink.pem'),
        // cert: fs.readFileSync(rootPath + '/resources/ssl/production/selink.crt')
    },
    apn: {
      cert: rootPath + '/resources/apn/production/cert.pem',
      key:  rootPath + '/resources/apn/production/key.pem',
      gateway: 'gateway.push.apple.com',
      port: 2195
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
