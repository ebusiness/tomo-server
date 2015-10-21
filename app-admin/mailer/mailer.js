var path = require('path'),
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
            from: '大中华柔术联盟 <info@auto.gcjjf.com>',
            to: recipient.email,
            subject: '欢迎加入大中华柔术联盟',
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
