class WebSocketNotification {
  constructor(notification) {
    const { room, event, data } = notification.payload;
    this.type = notification.type;
    this.payload = { room, event, data };
  }
  getType() {
    return this.type;
  }
}

module.exports = WebSocketNotification;
