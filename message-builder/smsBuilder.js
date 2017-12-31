const SMSNotification = require('./../model/SMSNotification');

module.exports = {
  build: (notification) => new SMSNotification(notification)
};
