const { expect } = require('chai');

const { Notification } = require('./../model');
const NotificationManager = require('./../manager');
const { TwilioSMSService } = require('./../delivery');
const { SMSNotificationDispatcher } = require('./../dispatcher');
const { combineBuildFunctions, smsBuilder } = require('./../message-builder');
const notificationTypes = require('./data/notification-ypes.json');
const fixtures = require('./data/twilio.fixtures.json');
const { accountSid, authToken } = require('./data/twilio.auth.json');

const dummySMSBuilder = {
  canBuild: () => true,
  build: combineBuildFunctions(smsBuilder.build, (notification) => {
    return notification;
  })
};

const notificationType = notificationTypes.dummyTypeNotification;
const notificationManager = new NotificationManager();

describe('SMS dispatching', () => {
  before(() => {
    const twilioService = new TwilioSMSService({ accountSid, authToken });
    notificationManager.registerDispatcher(new SMSNotificationDispatcher(
      notificationType,
      dummySMSBuilder,
      twilioService
    ));
  })

  it('should be able to dispatch when data is valid', (done) => {
    const { to, from, body } = fixtures['valid-message'];

    const notification = new Notification(notificationType, { to, from, body });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      result => expect(result.status).to.equal('queued'),
      (e) => { },
      () => done()
    );
  }).timeout('5s');

  it('should not be able to dispatch when `from` is corrupted', (done) => {
    const { to, from, body } = fixtures['missing-from-message'];

    const notification = new Notification(notificationType, { to, from, body });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      () => { },
      (e) => {
        expect(e.message).to.equal('`from` field missing from payload');
        done()
      },
      () => done()
    );
  }).timeout('5s');

  it('should not be able to dispatch when `from` is corrupted', (done) => {
    const { to, from, body } = fixtures['missing-to-message'];

    const notification = new Notification(notificationType, { to, from, body });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      () => { },
      (e) => {
        expect(e.message).to.equal('`to` field missing from payload');
        done()
      },
      () => done()
    );
  }).timeout('5s');


  it('should not be able to dispatch when `body` is corrupted', (done) => {
    const { to, from, body } = fixtures['missing-body-message'];

    const notification = new Notification(notificationType, { to, from, body });
    const result$ = notificationManager.dispatch(notification);
    result$.subscribe(
      () => { },
      (e) => {
        expect(e.message).to.equal('`body` field missing from payload');
        done()
      },
      () => done()
    );
  }).timeout('5s');

})