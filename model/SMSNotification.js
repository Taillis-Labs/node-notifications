class SMSNotification {
  /**
   * @param {SMSNotification|object} data
   */
  constructor(data = {}) {
    this.phone = data.phone;
    this.message = data.message;
  }
}

module.exports = SMSNotification;
