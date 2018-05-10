// @flow
const debug = require('debug')('analytics:queues:track');
import Raven from 'shared/raven';
import type { Job, TrackAnalyticsData } from 'shared/bull/types';
import { getContext, track, hash } from '../utils';

const processJob = async (job: Job<TrackAnalyticsData>) => {
  const { userId, event, context, properties = {} } = job.data;

  if (!context) {
    return track(hash(userId), event, { ...properties });
  }

  const contextProperties = await getContext({ userId, ...context });

  return await track(hash(userId), event, {
    ...contextProperties,
    ...properties,
  });
};

export default async (job: Job<TrackAnalyticsData>) => {
  try {
    await processJob(job);
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
