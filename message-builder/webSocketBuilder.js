const WebSocketNotification = require('./../model/WebSocketNotification');

module.exports = {
  build: (notification) => new WebSocketNotification(notification),
};
