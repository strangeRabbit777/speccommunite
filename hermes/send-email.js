// @flow
import isEmail from 'validator/lib/isEmail';
import sg from '@sendgrid/mail';
const debug = require('debug')('hermes:send-email');
const stringify = require('json-stringify-pretty-compact');
import { deactivateUserEmailNotifications } from './models/usersSettings';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
const { SENDGRID_API_KEY } = process.env;

type Options = {
  templateId: string,
  to: string,
  dynamic_template_data: Object,
  userId?: string,
};

const defaultOptions = {
  from: {
    email: 'hi@spectrum.chat',
    name: 'Spectrum',
  },
  tracking_settings: {
    click_tracking: {
      enable: false,
    },
  },
};

const sendEmail = (options: Options) => {
  const { templateId, to, dynamic_template_data, userId } = options;

  if (SENDGRID_API_KEY !== 'undefined') {
    debug(
      `--Send LIVE email with templateId ${templateId}--\nto: ${to}\ndynamic_template_data: ${stringify(
        dynamic_template_data
      )}`
    );
    sg.setApiKey(SENDGRID_API_KEY);
  } else {
    debug(`--Send TEST email with templateId ${templateId}--\n--to: ${to}--`);

    // eslint-disable-next-line
    debug(
      stringify({
        templateId,
        to,
        dynamic_template_data,
        userId,
      })
    );

    return;
  }

  if (userId) {
    trackQueue.add({
      userId: userId,
      event: events.EMAIL_RECEIVED,
    });
  }

  if (!to) {
    if (userId) {
      trackQueue.add({
        userId: userId,
        event: events.EMAIL_BOUNCED,
        properties: { error: 'To field was not provided' },
      });
    }

    return;
  }

  // qq.com email addresses are isp blocked, which raises our error rate
  // on sendgrid. prevent sending these emails at all
  if (to.substr(to.length - 7) === '@qq.com') {
    return;
  }

  // $FlowFixMe
  return new Promise((res, rej) => {
    sg.send(
      {
        ...defaultOptions,
        templateId,
        to,
        dynamic_template_data,
      },
      async err => {
        if (err) {
          if (err.status === 553 || err.status === 554) {
            if (userId) {
              trackQueue.add({
                userId: userId,
                event: events.EMAIL_BOUNCED,
                properties: { error: err.message },
              });
            }

            return await deactivateUserEmailNotifications(to)
              .then(() => rej(err))
              .catch(e => rej(e));
          }

          console.error('Error sending email:');
          console.error(err);
          return rej(err);
        }

        res();
        debug(`email to ${to} sent successfully`);
      }
    );
  });
};

export default sendEmail;
