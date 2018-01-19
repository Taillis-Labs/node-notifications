const isNil = require('lodash/isNil');
class WebSocketService {
  constructor(io) {
    this.io = io;
  }

  async send(notification) {
    const { room, event, data } = notification.payload;
  
    if (isNil(room)) throw new Error('Room is not defined');
    if (isNil(event)) throw new Error('Event is not defined');

    return this.io.to(room).emit(event, data);
  }

}

module.exports = WebSocketService;
