class SMSNotification {

  constructor(notification) {
    const { from, to, body } = notification.payload;
    this.type = notification.type;
    this.payload = { from, to, body };
  }
  getType() {
    return this.type;
  }
}

module.exports = SMSNotification;
