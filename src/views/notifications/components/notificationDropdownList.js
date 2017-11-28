import React from 'react';
import { NotificationListContainer } from '../style';
import { parseNotification } from '../utils';
import { sortByDate } from '../../../helpers/utils';
import { MiniNewMessageNotification } from './newMessageNotification';
import { MiniNewReactionNotification } from './newReactionNotification';
import { MiniNewChannelNotification } from './newChannelNotification';
import { MiniNewThreadNotification } from './newThreadNotification';
import { MiniNewUserInCommunityNotification } from './newUserInCommunityNotification';
import { MiniCommunityInviteNotification } from './communityInviteNotification';
import { MiniMentionMessageNotification } from './mentionMessageNotification';
import { MiniMentionThreadNotification } from './mentionThreadNotification';

export const NotificationDropdownList = ({
  rawNotifications,
  currentUser,
  history,
  markSingleNotificationAsSeenInState,
}) => {
  /*
    parse the notifications and cut it down to the latest 5
  */
  let notifications = rawNotifications
    .map(notification => parseNotification(notification))
    .slice(0, 10)
    .filter(
      notification => notification.context.type !== 'DIRECT_MESSAGE_THREAD'
    );

  notifications = sortByDate(notifications, 'modifiedAt', 'desc');

  return (
    <NotificationListContainer>
      {notifications.map(notification => {
        switch (notification.event) {
          case 'MESSAGE_CREATED': {
            return (
              <MiniNewMessageNotification
                key={notification.id}
                notification={notification}
                currentUser={currentUser}
                history={history}
              />
            );
          }
          case 'REACTION_CREATED': {
            return (
              <MiniNewReactionNotification
                key={notification.id}
                notification={notification}
                currentUser={currentUser}
                history={history}
              />
            );
          }
          case 'CHANNEL_CREATED': {
            return (
              <MiniNewChannelNotification
                key={notification.id}
                notification={notification}
                currentUser={currentUser}
                history={history}
                markSingleNotificationAsSeenInState={
                  markSingleNotificationAsSeenInState
                }
              />
            );
          }
          case 'USER_JOINED_COMMUNITY': {
            return (
              <MiniNewUserInCommunityNotification
                key={notification.id}
                notification={notification}
                currentUser={currentUser}
                history={history}
                markSingleNotificationAsSeenInState={
                  markSingleNotificationAsSeenInState
                }
              />
            );
          }
          case 'THREAD_CREATED': {
            return (
              <MiniNewThreadNotification
                key={notification.id}
                notification={notification}
                currentUser={currentUser}
                history={history}
              />
            );
          }
          case 'COMMUNITY_INVITE': {
            return (
              <MiniCommunityInviteNotification
                key={notification.id}
                notification={notification}
                currentUser={currentUser}
                history={history}
                markSingleNotificationAsSeenInState={
                  markSingleNotificationAsSeenInState
                }
              />
            );
          }
          case 'MENTION_THREAD': {
            return (
              <MiniMentionThreadNotification
                key={notification.id}
                notification={notification}
                currentUser={currentUser}
                history={history}
              />
            );
          }
          case 'MENTION_MESSAGE': {
            return (
              <MiniMentionMessageNotification
                key={notification.id}
                notification={notification}
                currentUser={currentUser}
                history={history}
              />
            );
          }
          default: {
            return null;
          }
        }
      })}
    </NotificationListContainer>
  );
};
