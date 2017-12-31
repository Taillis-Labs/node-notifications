class SendgridEmailNotification {
  constructor(data = {}) {
    this.from = data.from;
    this.to = data.to;
    this.subject = data.subject;
    this.substutions = data.substutions;
    this.template = data.template;
  }
}

module.exports = SendgridEmailNotification;
