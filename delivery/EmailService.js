const merge = require('lodash/merge');


class EmailService {
  constructor(mailer) {
    this.mailer = mailer;
  }

  createMessage(notification) {
    const message = {
      from: notification.from,
      to: notification.to,
      subject: notification.subject,
    };

    if (notification.isHTML) {
      message.html = notification.content;
    } else {
      message.text = notification.content;
    }

    return message;
  }

  async send(notification) {
    const message = this.createMessage(notification);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ notification, status: 'succes' }), 2000);
      /* this.mailer.sendMail(message, (err, info) => {
        if (err) {
          return reject(err);
        }
        return resolve(info);
      });*/
    });
  }
}


module.exports = EmailService;
