const { expect } = require('chai');
const { StandardNotification } = require('./../model');
const NotificationManager = require('./../manager');
const { SMTPEmailService, MailgunEmailService, SendgridEmailService } = require('./../delivery');
const { EmailNotificationDispatcher } = require('./../dispatcher');
const { combineBuildFunctions, standardEmailBuilder, sendgridEmailBuilder } = require('./../message-builder');
const mailgunAuth = require('./data/mailgun.auth.json');
const nodeMailerAuth = require('./data/smtp.auth.json');
const fixtures = require('./data/multi.dispatch.fixtures.json');
const notificationTypes = require('./data/notification-ypes.json');

const dummyEmailSMTPBuilder = {
  canBuild: (notification) => {
    const { payload: { receiver: { settings } } } = notification;
    return settings.useSMTP;
  },
  build: combineBuildFunctions(standardEmailBuilder.build, (notification) => {
    const { payload } = notification;
    const { sender, receiver } = payload;
    return {
      from: sender.email,
      to: receiver.email,
      subject: `Please check our dummy smtp email ${receiver.name}`,
      body: `Hi ${receiver.name}. \n\nJust saying hello.\n\nNode Notification Team`,
      isHTML: true,
    }
  })
}
const dummyEmailMailgunBuilder = {
  canBuild: (notification) => {
    const { payload: { receiver: { settings } } } = notification;
    return settings.useMailgun;
  },
  build: combineBuildFunctions(standardEmailBuilder.build, (notification) => {
    const { payload } = notification;
    const { sender, receiver } = payload;
    return {
      from: sender.email,
      to: receiver.email,
      subject: `Please check our dummy smtp email ${receiver.name}`,
      body: `Hi ${receiver.name}. \n\nJust saying hello.\n\nNode Notification Team`,
      isHTML: true,
    }
  })
}

const notificationType = notificationTypes.dummyTypeNotification;

describe('Multi dispatching', () => {
  const notificationManager = new NotificationManager();

  before((done) => {
    const smtpEmailService = new SMTPEmailService(nodeMailerAuth);
    const mailgunEmailService = new MailgunEmailService(mailgunAuth);

    notificationManager.registerDispatcher(new EmailNotificationDispatcher(
      notificationType,
      dummyEmailSMTPBuilder,
      smtpEmailService
    ));
    notificationManager.registerDispatcher(new EmailNotificationDispatcher(
      notificationType,
      dummyEmailMailgunBuilder,
      mailgunEmailService
    ));

    done();
  });

  it('should be able to dispatch using multiple deliveries (based on notification settings)', (done) => {
    let i = 0;
    const { sender, receiver } = fixtures["use-multi-dispatcher"];
    const notification = new StandardNotification(notificationType, { sender, receiver });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      () => i = i + 1,
      () => { },
      () => {
        expect(i).to.equal(2);
        done();
      }
    );
  }).timeout('5s');

  it('should not be able to dispatch using all deliveries (based on notification settings)', (done) => {
    let i = 0;
    const { sender, receiver } = fixtures["use-one-dispatcher"];
    const notification = new StandardNotification(notificationType, { sender, receiver });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      (result) => i = i + 1,
      () => { },
      () => {
        expect(i).to.equal(1);
        done();
      }
    );
  }).timeout('5s');
});

describe('No dispatcher registered', () => {
  const notificationManager = new NotificationManager();

  it('should throw an error when no dispatcher is registered for notification type', (done) => {
    const { sender, receiver } = fixtures["use-one-dispatcher"];
    const notification = new StandardNotification(notificationType, { sender, receiver });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      (result) => { console.log(result) },
      (error) => {
        expect(error.message).to.equal(`No Dispatcher has been registered for type notification of ${notificationType}`);
        done();
      }
    );
  });
});