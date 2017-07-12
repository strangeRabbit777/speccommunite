import webPush from 'web-push';
const debug = require('debug')('iris:utils:web-push');
import { getSubscriptions } from '../models/web-push-subscription';
import formatNotification from './notification-formatting';

try {
  webPush.setVapidDetails(
    'https://spectrum.chat',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('Web push notifications to enabled!');
} catch (err) {}

export const sendWebPushNotification = (subscription, payload, options) => {
  if (!subscription || !payload) {
    if (process.env.NODE_ENV === 'development')
      console.log(
        'No subscription or payload provided to sendWebPushNotification, not pushing anything.'
      );
    return Promise.resolve({});
  }
  debug(`send notification to endpoint ${subscription.endpoint}`);
  const pl = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return webPush.sendNotification(subscription, pl, {
    TTL: 86400, // Default TTL: One day
    ...options,
  });
};

// Send a notification as a web push notification (maybe)
export const sendNotificationAsWebPush = notification => {
  debug('send notification as web push notification');
  // Don't sent push notifications for channel creation
  // if (notification.event === 'CHANNEL_CREATED') return;
  return getSubscriptions(notification.userId)
    .then(subscriptions => {
      if (!subscriptions || subscriptions.length === 0) {
        debug(`no subscription for user#${notification.userId}, `);
        return Promise.resolve(false);
      }

      const payload = formatNotification(notification, notification.userId);
      debug('subscriptions found: %O', subscriptions);
      return Promise.all(
        subscriptions.map(subscription =>
          sendWebPushNotification(subscription, {
            tag: notification.id,
            ...payload,
          })
        )
      );
    })
    .catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
    });
};
