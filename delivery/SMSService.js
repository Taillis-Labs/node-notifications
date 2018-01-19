const merge = require('lodash/merge');


class SMSService {
  constructor(messagebird) {
    this.messagebird = messagebird;
    this.messageDefaults = {};
  }

  setMessageDefaults(defaults) {
    merge(this.messageDefaults, defaults);
  }

  createMessage(notification) {
    return {
      originator: this.messageDefaults.from,
      recipients: [notification.phone],
      body: notification.message,
    };
  }

  async send(notification) {
    const message = this.createMessage(notification);

    try {
      const response = await this.sendMessage(message);

      return true;
    } catch (error) {
      const { statusCode, errors } = error;

      return false;
    }
  }

  async sendMessage(message) {
    return new Promise((resolve, reject) =>
      this.messagebird.messages.create(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        return resolve(response);
      }));
  }
}


module.exports = SMSService;
