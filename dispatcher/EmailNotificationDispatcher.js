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

  async createNotification(data) {
    return this.messageBuilder.build(data);
  }

  async send(emailNotification) {
    return this.emailService.send(emailNotification);
  }

  shouldDispatch(notification) {
    return this.messageBuilder.canBuild(notification);
  }

  dispatch(notification) {
    const shouldDispatch = this.shouldDispatch(notification);
    if (shouldDispatch) {
      return Rx.Observable.fromPromise(this.createNotification(notification))
        .flatMap(emailNotification => Rx.Observable.fromPromise(this.send(emailNotification)));
    }
    return Rx.Observable.empty();
  }
}

module.exports = EmailNotificationDispatcher;
