// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { uploadImage } from '../../utils/s3';
import { storeMessage } from '../../models/message';
import { setDirectMessageThreadLastActive } from '../../models/directMessageThread';
import { setUserLastSeenInDirectMessageThread } from '../../models/usersDirectMessageThreads';
import { createMemberInChannel } from '../../models/usersChannels';
import {
  createParticipantInThread,
  createParticipantWithoutNotificationsInThread,
} from '../../models/usersThreads';
import addCommunityMember from '../communityMember/addCommunityMember';

type AddMessageInput = {
  message: {
    threadId: string,
    threadType: 'story' | 'directMessageThread',
    messageType: 'text' | 'media' | 'draftjs',
    content: {
      body: string,
    },
    file?: {
      name: string,
      type: string,
      size: number,
      path: string,
    },
  },
};

export default async (
  _: any,
  { message }: AddMessageInput,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to send a message.');
  }

  if (message.messageType === 'media' && !message.file) {
    return new UserError(
      "Can't send media message without an image, please try again."
    );
  }

  if (message.messageType !== 'media' && message.file) {
    return new UserError(
      `To send an image, please use messageType: "media" instead of "${
        message.messageType
      }".`
    );
  }

  // construct the shape of the object to be stored in the db
  let messageForDb = Object.assign({}, message);
  if (message.file && message.messageType === 'media') {
    const fileMetaData = {
      name: message.file.name,
      size: message.file.size,
      type: message.file.type,
    };
    const url = await uploadImage(message.file, 'threads', message.threadId);
    messageForDb = Object.assign({}, messageForDb, {
      content: {
        body: url,
      },
      file: fileMetaData,
    });
  }

  const messagePromise = async () =>
    await storeMessage(messageForDb, currentUser.id);

  // handle DM thread messages up front
  if (message.threadType === 'directMessageThread') {
    setDirectMessageThreadLastActive(message.threadId);
    setUserLastSeenInDirectMessageThread(message.threadId, currentUser.id);
    return await messagePromise();
  }

  // at this point we are only dealing with thread messages
  const thread = await loaders.thread.load(message.threadId);

  if (thread.isDeleted) {
    return new UserError("Can't reply in a deleted thread.");
  }

  if (thread.isLocked) {
    return new UserError("Can't reply in a locked thread.");
  }

  const [communityPermissions, channelPermissions] = await Promise.all([
    loaders.userPermissionsInCommunity.load([
      currentUser.id,
      thread.communityId,
    ]),
    loaders.userPermissionsInChannel.load([thread.channelId, currentUser.id]),
  ]);

  const isBlockedInCommunity =
    communityPermissions && communityPermissions.isBlocked;
  const isBlockedInChannel = channelPermissions && channelPermissions.isBlocked;

  // user can't post if blocked at any level
  if (isBlockedInCommunity || isBlockedInChannel) {
    return new UserError(
      "You don't have permission to post in this conversation"
    );
  }

  const participantPromise = async () => {
    if (thread.watercooler) {
      return await createParticipantWithoutNotificationsInThread(
        message.threadId,
        currentUser.id
      );
    } else {
      return await createParticipantInThread(message.threadId, currentUser.id);
    }
  };

  // dummy async function that will run if the user is already a member of the
  // channel where the message is being sent
  let membershipPromise = async () => await {};

  // if the user is a member of the community, but is not a member of the channel,
  // make sure they join the channel first
  if (
    communityPermissions &&
    communityPermissions.isMember &&
    (!channelPermissions || !channelPermissions.isMember)
  ) {
    membershipPromise = async () =>
      await createMemberInChannel(thread.channelId, currentUser.id);
  }

  // if the user is not a member of the community, or has previously joined
  // and left the community, re-join and sub to default channels
  if (
    !communityPermissions ||
    (communityPermissions && !communityPermissions.isMember)
  ) {
    membershipPromise = async () =>
      await addCommunityMember(
        {},
        { input: { communityId: thread.communityId } },
        { user: currentUser, loaders: loaders }
      );
  }

  return membershipPromise()
    .then(() => participantPromise())
    .then(() => messagePromise())
    .then(dbMessage => {
      const contextPermissions = {
        communityId: thread.communityId,
        reputation: communityPermissions ? communityPermissions.reputation : 0,
        isModerator: communityPermissions
          ? communityPermissions.isModerator
          : false,
        isOwner: communityPermissions ? communityPermissions.isOwner : false,
      };

      return {
        ...dbMessage,
        contextPermissions,
      };
    })
    .catch(err => {
      console.log('Error sending message', err);
      return new UserError('Error sending message, please try again');
    });
};
