var _ = require('lodash'),
  path = require('path'),
  templatesDir = path.resolve(__dirname, 'templates'),
  emailTemplates = require('email-templates'),
  nodemailer = require('nodemailer');

// Setup mail transport facility
var transport = nodemailer.createTransport(config.mail);

exports.accountActive = function(recipient) {

  emailTemplates(templatesDir, function(err, template) {

    if (err) console.log(err);
    else {

      // send account active email
      template('account-active', recipient, function(err, html, text) {
        if (err) console.log(err);
        else {
          transport.sendMail({
            from: '現場Tomo <info@genba-tomo.com>',
            to: recipient.email,
            subject: '欢迎加入現場Tomo',
            html: html,
            text: text
          }, function(err, responseStatus) {
            if (err) console.log(err);
            else {
              console.log(responseStatus.message);
            }
          });
        }
      });
    }
  });
};

exports.resetPassword = function(recipient) {

  emailTemplates(templatesDir, function(err, template) {

    if (err) console.log(err);
    else {

      // send account active email
      template('password-retrieve', recipient, function(err, html, text) {
        if (err) console.log(err);
        else {
          transport.sendMail({
            from: '現場Tomo <info@genba-tomo.com>',
            to: recipient.email,
            subject: '現場Tomo－重置密码',
            html: html,
            text: text
          }, function(err, responseStatus) {
            if (err) console.log(err);
            else {
              console.log(responseStatus.message);
            }
          });
        }
      });
    }
  });
};
