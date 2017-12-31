const StandardEmailNotification = require('./../model/StandardEmailNotification');

module.exports = {
  build: (notification) => new StandardEmailNotification(notification)
};
