const SMTPEmailService = require('./SMTPEmailService');
const MailgunEmailService = require('./MailgunEmailService');
const SendgridEmailService = require('./SendgridEmailService');

module.exports = {
  SMTPEmailService,
  MailgunEmailService,
  SendgridEmailService
};