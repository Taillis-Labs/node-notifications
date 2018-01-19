const assert = require('assert');
const twilio = require('twilio');

class TwilioSMSService {
  constructor(options = {}) {
    const { accountSid, authToken } = options;
    assert.notEqual(accountSid, undefined, '`accountSid` field can not be undefined');
    assert.notEqual(authToken, undefined, '`authToken` field can not be undefined');
    this.client = new twilio(accountSid, authToken);
  }

  async send(notification) {
    const { from, to, body } = notification.payload;

    assert.notEqual(from, undefined, '`from` field missing from payload');
    assert.notEqual(to, undefined, '`to` field missing from payload');
    assert.notEqual(body, undefined, '`body` field missing from payload');

    return this.client.messages.create({ body, to, from });


  }

}

module.exports = TwilioSMSService;

