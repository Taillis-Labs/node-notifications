class Notification {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
  getType() {
    return this.type;
  }
}

module.exports = Notification;
