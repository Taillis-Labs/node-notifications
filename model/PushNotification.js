class PushNotification {
  /**
   * @param {PushNotification|object} data
   */
  constructor(data = {}) {
    this.title = data.title;
    this.message = data.message;
    this.data = data.data;
    this.options = data.options;
  }
}


module.exports = PushNotification;
