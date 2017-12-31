const sendgrid = require('sendgrid');
const assert = require('assert');

const method = 'POST';
const path = '/v3/mail/send';

class SendgridEmailService {
  constructor(options = {}) {
    const { apiKey } = options;
    assert.notEqual(apiKey, undefined, '`apiKey` field can not be undefined');
    this.mailer = sendgrid(apiKey);
  }

  createMessage(notification) {
    const { substitutions, to, from, template, subject } = notification;
    const message = {
      method,
      path,
      body: {
        personalizations: [
          {
            to,
            subject,
            substitutions
          }
        ],
        template_id: template,
        from
      }
    }

    return message;
  }

  async send(notification) {
    const message = this.mailer.emptyRequest(this.createMessage(notification));
    return this.mailer.API(message);
  }
}


module.exports = SendgridEmailService;
