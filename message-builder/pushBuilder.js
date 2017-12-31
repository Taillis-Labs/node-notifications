const PushNotification = require('./../model/PushNotification');

module.exports = {
  build: (notification) => new PushNotification(notification)
};
