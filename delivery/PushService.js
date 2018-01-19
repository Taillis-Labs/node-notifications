/* eslint-disable class-methods-use-this */

const merge = require('lodash/merge');

class PushService {
  constructor(oneSignalPushService, options) {
    this.oneSignalPushService = oneSignalPushService;
    this.appId = options.appId;
  }

  buildOneSignalNotification(notification) {
    return {
      app_id: this.appId,
      headings: { en: notification.title },
      contents: { en: notification.message },
      data: notification.data,
    };
  }

  applyFilters(oneSignalNotification, filters) {
    return merge(oneSignalNotification, { filters });
  }

  async send(notification) {
    const data = this.buildOneSignalNotification(notification);

    await this.oneSignalPushService.createNotification(data);
  }
}

module.exports = PushService;
