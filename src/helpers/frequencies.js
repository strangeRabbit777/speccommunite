import { FREQUENCIES } from './regexps';

export const getCurrentFrequency = (activeFrequency, frequencies) => {
  if (activeFrequency === 'everything') {
    return;
  }

  return frequencies.find(
    freq => freq.slug === activeFrequency || freq.id === activeFrequency,
  );
};

export const getFrequencyPermission = (user, activeFrequency, frequencies) => {
  let frequencyToEval = getCurrentFrequency(activeFrequency, frequencies);
  if (!frequencyToEval) return;

  let frequencyUsers = frequencyToEval.users;
  // make sure this user is viewing a frequency they have joined
  if (!frequencyUsers[user.uid]) return;
  let usersPerm = frequencyUsers[user.uid].permission;
  return usersPerm;
};

export const linkFreqsInMd = text => {
  return text.replace(FREQUENCIES, '$1[$2](https://spectrum.chat/$2)');
};

export const groupFrequencies = frequencies => {
  const grouped = {};
  frequencies.forEach(frequency => {
    const { community } = frequency;
    if (!grouped[community]) grouped[community] = [];
    grouped[community].push(frequency);
  });
  return grouped;
};
