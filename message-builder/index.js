const pushBuilder = require('./pushBuilder');
const smsBuilder = require('./smsBuilder');
const standardEmailBuilder = require('./standardEmailBuilder');
const sendgridEmailBuilder = require('./sendgridEmailBuilder');

const combineBuildFunctions = (a, b) => (c) => a(b(c))

module.exports = {
  standardEmailBuilder,
  sendgridEmailBuilder,
  pushBuilder,
  smsBuilder,
  combineBuildFunctions
};