const Rx = require('@reactivex/rxjs');
const isNil = require('lodash/isNil');

class NotificationManager {
  constructor() {
    this.dispatchers = {};
  }

  registerDispatcher(dispatcher) {
    this.dispatchers[dispatcher.getType()] = this.dispatchers[dispatcher.getType()] || [];
    this.dispatchers[dispatcher.getType()].push(dispatcher);
  }

  dispatch(notification) {
    // TODO: need to throw error if no dispatcher is register for a given type of notification
    const dispatchers = this.dispatchers[notification.getType()];

    if (isNil(dispatchers)) {
      return Rx.Observable.throw(
        new Error(`No Dispatcher has been registered for type notification of ${notification.getType()}`)
      )
    }
    
    return Rx.Observable.from(this.dispatchers[notification.getType()])
      .flatMap(dispatcher => dispatcher.dispatch(notification));
  }
}


module.exports = NotificationManager;
