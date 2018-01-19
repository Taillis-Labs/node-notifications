const EmailNotificationDispatcher = require('./EmailNotificationDispatcher');
const PushNotificationDispatcher = require('./PushNotificationDispatcher');
const SMSNotificationDispatcher = require('./SMSNotificationDispatcher');
const WebSocketDispatcher = require('./WebSocketDispatcher');
module.exports = {
  EmailNotificationDispatcher,
  PushNotificationDispatcher,
  SMSNotificationDispatcher,
  WebSocketDispatcher,
};