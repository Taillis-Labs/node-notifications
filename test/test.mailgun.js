const { expect } = require('chai');
const { StandardNotification } = require('./../model');
const NotificationManager = require('./../manager');
const { MailgunEmailService, } = require('./../delivery');
const { EmailNotificationDispatcher } = require('./../dispatcher');
const { combineBuildFunctions, standardEmailBuilder } = require('./../message-builder');
const auth = require('./data/mailgun.auth.json');
const fixtures = require('./data/mailgun.fixtures.json');
const notificationTypes = require('./data/notification-ypes.json');

const dummyEmailMailgunBuilder = {
  canBuild: () => true,
  build: combineBuildFunctions(standardEmailBuilder.build, (notification) => {
    const { payload } = notification;
    const { sender, receiver } = payload;
    return {
      from: sender.email,
      to: receiver.email,
      subject: `Please check our dummy smtp email ${receiver.name}`,
      body: `Hi ${receiver.name}. \n\nJust saying hello.\n\nRegards,`,
      isHTML: true,
    }
  })
};

const notificationType = notificationTypes.dummyTypeNotification;
const notificationManager = new NotificationManager();

describe('Mailgun dispatching', () => {
  beforeEach((done) => {
    const mailgunEmailService = new MailgunEmailService(auth);

    notificationManager.registerDispatcher(new EmailNotificationDispatcher(
      notificationType,
      dummyEmailMailgunBuilder,
      mailgunEmailService
    ));

    done();
  })

  it('should be able to dispatch when data is valid', (done) => {
    const { sender, receiver } = fixtures["valid-message"];
    const notification = new StandardNotification(notificationType, { sender, receiver });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      result => expect(result.message).to.equal('Queued. Thank you.'),
      (e) => { },
      () => done()
    );
  }).timeout('5s');

  it('should not be able to dispatch when `from` is corrupted', (done) => {
    const { sender, receiver } = fixtures["missing-from-message"];
    const notification = new StandardNotification(notificationType, { sender, receiver });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      () => () => { },
      (e) => {
        expect(e.message).to.equal('`from` field can not be undefined');
        done()
      },
      () => { }
    );
  }).timeout('5s');

  it('should not be able to dispatch when `to` is corrupted', (done) => {
    const { sender, receiver } = fixtures["missing-to-message"];
    const notification = new StandardNotification(notificationType, { sender, receiver });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      () => () => { },
      (e) => {
        expect(e.message).to.equal('`to` field can not be undefined');
        done()
      },
      () => { }
    );
  }).timeout('5s');
});