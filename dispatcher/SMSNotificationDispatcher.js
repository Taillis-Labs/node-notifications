const Rx = require('@reactivex/rxjs');
class SMSNotificationDispatcher {
  constructor(notificationType, messageBuilder, smsService) {
    this.notificationType = notificationType;
    this.messageBuilder = messageBuilder;
    this.smsService = smsService;
  }

  getType() {
    return this.notificationType;
  }

  async createNotification(data) {
    return this.messageBuilder.build(data);
  }

  async send(notification) {
    return this.smsService.send(notification);
  }

  shouldDispatch(notification) {
    return this.messageBuilder.canBuild(notification);
  }

  dispatch(notification) {
    const shouldDispatch = this.shouldDispatch(notification);
    if (shouldDispatch) {
      return Rx.Observable.fromPromise(this.createNotification(notification))
        .flatMap(notification => Rx.Observable.fromPromise(this.send(notification)));
    }
    return Rx.Observable.empty();
  }
}

module.exports = SMSNotificationDispatcher;
