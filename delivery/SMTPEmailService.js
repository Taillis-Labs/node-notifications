const nodemailer = require('nodemailer');
const assert = require('assert');


class SMTPEmailService {
  constructor(options = {}) {
    const { service, user, pass } = options;
    assert.equal(service, 'gmail');
    assert.notEqual(user, undefined, '`user` field can not be undefined');
    assert.notEqual(pass, undefined, '`pass` field can not be undefined');
    this.mailer = nodemailer.createTransport({ service, auth: { user, pass } });
  }

  checkRequiredFields(notification) {
    const { from, to } = notification;
    assert.notEqual(from, undefined, '`from` field can not be undefined');
    assert.notEqual(to, undefined, '`to` field can not be undefined');
  }

  createMessage(notification) {
    this.checkRequiredFields(notification);

    const { from, to, subject, isHTML, body } = notification;
    const message = { from, to, subject };

    if (notification.isHTML) {
      message.html = body;
    } else {
      message.text = body;
    }

    return message;
  }

  async send(notification) {
    const message = this.createMessage(notification);
    return new Promise((resolve, reject) => {
      this.mailer.sendMail(message, (err, info) => {
        if (err) {
          return reject(err);
        }
        return resolve(info);
      });
    });
  }
}

module.exports = SMTPEmailService;
