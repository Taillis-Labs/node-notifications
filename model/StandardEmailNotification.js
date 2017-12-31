class EmailNotification {
  constructor(data = {}) {
    this.from = data.from;
    this.to = data.to;
    this.subject = data.subject;
    this.body = data.body;
    this.isHTML = data.isHTML;
  }
}

module.exports = EmailNotification;
