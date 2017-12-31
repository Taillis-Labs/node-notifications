const { expect } = require('chai');
const { StandardNotification } = require('./../model');
const NotificationManager = require('./../manager');
const { SMTPEmailService, } = require('./../delivery');
const { EmailNotificationDispatcher } = require('./../dispatcher');
const { combineBuildFunctions, standardEmailBuilder } = require('./../message-builder');
const auth = require('./data/smtp.auth.json');
const fixtures = require('./data/smtp.fixtures.json');
const notificationTypes = require('./data/notification-ypes.json');

const dummyEmailSMTPBuilder = {
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

describe('Node Mailer dispatching', () => {
  beforeEach((done) => {
    const smtpEmailService = new SMTPEmailService(auth);

    notificationManager.registerDispatcher(new EmailNotificationDispatcher(
      notificationType,
      dummyEmailSMTPBuilder,
      smtpEmailService
    ));

    done();
  })

  it('should be able to dispatch when data is valid', (done) => {
    const { sender, receiver } = fixtures["valid-message"];
    const notification = new StandardNotification(notificationType, { sender, receiver });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      result => expect(result.rejected.length).to.equal(0),
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
  });

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
  });
})