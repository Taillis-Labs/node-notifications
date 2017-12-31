const Rx = require('@reactivex/rxjs');
const merge = require('lodash/merge');
const isNil = require('lodash/isNil');

class EmailNotificationDispatcher {
  constructor(notificationType, messageBuilder, emailService) {
    this.notificationType = notificationType;
    this.messageBuilder = messageBuilder;
    this.emailService = emailService;
  }

  getType() {
    return this.notificationType;
  }

  async createEmailNotification(notification) {
    return this.messageBuilder.build(notification);
  }

  async sendEmail(emailNotification) {
    return this.emailService.send(emailNotification);
  }

  shouldDispatch(notification) {
    return this.messageBuilder.canBuild(notification);
  }

  dispatch(notification) {
    const shouldDispatch = this.shouldDispatch(notification);
    if (shouldDispatch) {
      return Rx.Observable.fromPromise(this.createEmailNotification(notification))
        .flatMap(emailNotification => Rx.Observable.fromPromise(this.sendEmail(emailNotification)));
    }
    return Rx.Observable.empty();
  }
}

module.exports = EmailNotificationDispatcher;
