const Rx = require('@reactivex/rxjs');

class WebSocketDispatcher {
  constructor(notificationType, messageBuilder, webSocketService) {
    this.notificationType = notificationType;
    this.messageBuilder = messageBuilder;
    this.webSocketService = webSocketService;
  }

  getType() {
    return this.notificationType;
  }

  async createNotification(data) {
    return this.messageBuilder.build(data);
  }

  async send(notification) {
    return this.webSocketService.send(notification);
  }

  shouldDispatch(notification) {
    return this.messageBuilder.canBuild(notification);
  }

  dispatch(notification) {
    const shouldDispatch = this.shouldDispatch(notification);
    if (shouldDispatch) {
      return Rx.Observable.fromPromise(this.createNotification(notification))
        .flatMap(webSocketNotification => Rx.Observable.fromPromise(this.send(webSocketNotification)));
    }
    return Rx.Observable.empty();
  }
}

module.exports = WebSocketDispatcher;
