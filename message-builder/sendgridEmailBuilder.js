const SendgridEmailNotification = require('./../model/SendgridEmailNotification');

module.exports = {
  build: (notification) => new SendgridEmailNotification(notification)
};
