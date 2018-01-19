const SMTPEmailService = require('./SMTPEmailService');
const MailgunEmailService = require('./MailgunEmailService');
const SendgridEmailService = require('./SendgridEmailService');
const WebSocketService = require('./WebSocketService');
const TwilioSMSService = require('./TwilioSMSService');
module.exports = {
  SMTPEmailService,
  MailgunEmailService,
  SendgridEmailService,
  WebSocketService,
  TwilioSMSService,
};