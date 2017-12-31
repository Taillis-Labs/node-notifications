const mailgun = require('mailgun-js');
const assert = require('assert');


class MailgunEmailService {
  constructor(options = {}) {
    const { domain, apiKey } = options;
    assert.notEqual(domain, undefined, '`domain` field can not be undefined');
    assert.notEqual(apiKey, undefined, '`apiKey` field can not be undefined');
    this.mailer = mailgun({ apiKey, domain });
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
    return this.mailer.messages().send(message);
  }
}

module.exports = MailgunEmailService;
