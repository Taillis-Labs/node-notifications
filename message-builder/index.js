const pushBuilder = require('./pushBuilder');
const smsBuilder = require('./smsBuilder');
const standardEmailBuilder = require('./standardEmailBuilder');
const sendgridEmailBuilder = require('./sendgridEmailBuilder');
const webSocketBuilder = require('./webSocketBuilder');

const combineBuildFunctions = (a, b) => (c) => a(b(c))

module.exports = {
  standardEmailBuilder,
  sendgridEmailBuilder,
  pushBuilder,
  smsBuilder,
  webSocketBuilder,
  combineBuildFunctions
};