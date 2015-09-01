var path = require('path'),
  filter = require('../utils/filter.js'),
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

exports.resetPassword = function(recipient) {

  emailTemplates(templatesDir, function(err, template) {

    if (err) console.log(err);
    else {

      // send account active email
      template('password-retrieve', recipient, function(err, html, text) {
        if (err) console.log(err);
        else {
          transport.sendMail({
            from: '大中华柔术联盟 <info@auto.gcjjf.com>',
            to: recipient.email,
            subject: '大中华柔术联盟－重置密码',
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

exports.accountApply = function(recipient) {

  emailTemplates(templatesDir, function(err, template) {

    if (err) console.log(err);
    else {

      // send account apply email
      template('account-apply', recipient, function(err, html, text) {
        if (err) console.log(err);
        else {
          transport.sendMail({
            from: '大中华柔术联盟 <info@auto.gcjjf.com>',
            to: recipient.email,
            subject: '大中华柔术联盟－正式会员申请已收到',
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

exports.accountPromote = function(recipient) {

  emailTemplates(templatesDir, function(err, template) {

    if (err) console.log(err);
    else {

      // send account promote email
      template('account-promote', recipient, function(err, html, text) {
        if (err) console.log(err);
        else {
          transport.sendMail({
            from: '大中华柔术联盟 <info@auto.gcjjf.com>',
            to: recipient.email,
            subject: '大中华柔术联盟－正式会员申请已获批准',
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

exports.eventApply = function(locals) {

  locals.divisions.forEach(function(division) {
    division.divisionType = filter.divisionType(division.type);
    division.ageDivision = filter.ageDivision(division.age);
    division.beltDivision = filter.beltDivision(division.belt);
    division.genderDivision = filter.genderDivision(division.gender);
  });

  emailTemplates(templatesDir, function(err, template) {

    if (err) console.log(err);
    else {

      // send account active email
      template('event-apply', locals, function(err, html, text) {
        if (err) console.log(err);
        else {
          transport.sendMail({
            from: '大中华柔术联盟 <info@auto.gcjjf.com>',
            to: locals.user.email,
            subject: '大中华柔术联盟－赛事报名成功',
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