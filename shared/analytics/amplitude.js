// @flow
require('now-env');
const Amplitude = require('amplitude');

const IS_PROD = process.env.NODE_ENV === 'production';

const AMPLITUDE_API_KEY = IS_PROD
  ? process.env.AMPLITUDE_API_KEY
  : 'API_KEY_GOES_HERE';

if (!AMPLITUDE_API_KEY) {
  console.warn('No amplitude api key provided');
}

export const amplitude = new Amplitude(AMPLITUDE_API_KEY);
