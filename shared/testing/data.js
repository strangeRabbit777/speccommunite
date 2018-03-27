// @flow
const seed = require('../../iris/migrations/seed/default/index');

const {
  defaultUsers,
  defaultUsersSettings,
  defaultCommunities,
  defaultCommunitySettings,
  defaultChannels,
  defaultChannelSettings,
  defaultThreads,
  defaultNotifications,
  defaultDirectMessageThreads,
  defaultUsersDirectMessageThreads,
  defaultUsersCommunities,
  defaultUsersChannels,
  defaultMessages,
  defaultUsersThreads,
} = seed;

const data = {
  users: defaultUsers,
  usersSettings: defaultUsersSettings,
  communities: defaultCommunities,
  communitySettings: defaultCommunitySettings,
  channels: defaultChannels,
  channelSettings: defaultChannelSettings,
  threads: defaultThreads,
  usersThreads: defaultUsersThreads,
  notifications: defaultNotifications,
  directMessageThreads: defaultDirectMessageThreads,
  usersDirectMessageThreads: defaultUsersDirectMessageThreads,
  usersCommunities: defaultUsersCommunities,
  usersChannels: defaultUsersChannels,
  messages: defaultMessages,
};

module.exports = data;
