const { expect } = require('chai');
const http = require('http');
const socketIO = require('socket.io');
const ioc = require('socket.io-client');

const { Notification } = require('./../model');
const NotificationManager = require('./../manager');
const { WebSocketService } = require('./../delivery');
const { WebSocketDispatcher } = require('./../dispatcher');
const { combineBuildFunctions, webSocketBuilder } = require('./../message-builder');
const notificationTypes = require('./data/notification-ypes.json');
const fixtures = require('./data/websocket.fixtures.json');

const hostname = '127.0.0.1';
const port = 3001;
const server = http.createServer(() => { });
const io = socketIO(server);
let socketClient;

const dummyWebSocketBuilder = {
  canBuild: () => true,
  build: combineBuildFunctions(webSocketBuilder.build, (notification) => {
    return notification;
  })
};

const notificationType = notificationTypes.dummyTypeNotification;
const notificationManager = new NotificationManager();

describe('WebSocket dispatching', () => {
  before((done) => {

    server.listen(port, hostname, () => {
      io.on('connection', function (socket) {
        socket.join('testroom');
      });

      socketClient = ioc(`http://${hostname}:${port}`);

      done();
    });
  })

  beforeEach((done) => {
    const webSocketService = new WebSocketService(io);
    notificationManager.registerDispatcher(new WebSocketDispatcher(
      notificationType,
      dummyWebSocketBuilder,
      webSocketService
    ));
    done();
  });

  it('should be able to dispatch when data is valid', (done) => {
    const payload = fixtures['valid-payload'];

    socketClient.on('testevent', function (data) {
      expect(data).to.equal('validdata'),
        done();
    });

    const notification = new Notification(notificationType, payload);
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe();

  }).timeout('5s');

  it('should not be able to dispatch when event is corrupted', (done) => {
    const payload = fixtures['missing-event-payload'];

    const notification = new Notification(notificationType, payload);
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      () => () => { },
      (e) => {
        expect(e.message).to.equal('Event is not defined');
        done()
      },
      () => { }
    );
  }).timeout('5s');

  it('should not be able to dispatch when room is corrupted', (done) => {
    const payload = fixtures['missing-room-payload'];

    const notification = new Notification(notificationType, payload);
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      () => () => { },
      (e) => {
        expect(e.message).to.equal('Room is not defined');
        done()
      },
      () => { }
    );
  }).timeout('5s');

  after((done) => {
    server.close(() => done());
  });

})