// @flow
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import { withRouter, type History, type Location } from 'react-router-dom';
import querystring from 'query-string';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import MembersList from './membersList';
import { TeamMembersList } from './teamMembersList';
import { MobileCommunityInfoActions } from './mobileCommunityInfoActions';
import { ChannelsList } from './channelsList';
import { CommunityMeta } from 'src/components/entities/profileCards/components/communityMeta';
import MessagesSubscriber from 'src/views/thread/components/messagesSubscriber';
import { PostsFeeds } from './postsFeeds';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { useAppScroller } from 'src/hooks/useAppScroller';
import ChatInput from 'src/components/chatInput';
import { ChatInputWrapper } from 'src/components/layout';
import { FeedsContainer, SidebarSection, InfoContainer } from '../style';

type Props = {
  community: CommunityInfoType,
  location: Location,
  history: History,
};

const Feeds = (props: Props) => {
  const { community, location, history } = props;
  const { search } = location;
  const { tab } = querystring.parse(search);

  const changeTab = (tab: string) => {
    return history.replace({
      ...location,
      search: querystring.stringify({ tab }),
    });
  };

  const handleTabRedirect = () => {
    const { search } = location;
    const { tab } = querystring.parse(search);

    if (!tab) {
      const defaultTab = community.watercoolerId ? 'chat' : 'posts';
      changeTab(defaultTab);
    }

    if (tab === 'chat' && !community.watercoolerId) {
      changeTab('posts');
    }
  };

  useEffect(() => {
    handleTabRedirect();
  }, [tab]);

  const renderFeed = () => {
    switch (tab) {
      case 'chat': {
        if (!community.watercoolerId) return null;
        return (
          <React.Fragment>
            <MessagesSubscriber isWatercooler id={community.watercoolerId} />
            <ChatInputWrapper>
              <ChatInput
                threadType="story"
                threadId={community.watercoolerId}
              />
            </ChatInputWrapper>
          </React.Fragment>
        );
      }
      case 'posts': {
        return <PostsFeeds community={community} />;
      }
      case 'members': {
        return (
          <MembersList
            id={community.id}
            filter={{ isMember: true, isBlocked: false }}
          />
        );
      }
      case 'info': {
        return (
          <InfoContainer>
            <SidebarSection style={{ paddingBottom: '16px' }}>
              <CommunityMeta community={community} />
            </SidebarSection>

            <SidebarSection>
              <TeamMembersList
                community={community}
                id={community.id}
                first={100}
                filter={{ isModerator: true, isOwner: true }}
              />
            </SidebarSection>

            <SidebarSection>
              <ChannelsList id={community.id} communitySlug={community.slug} />
            </SidebarSection>

            <SidebarSection>
              <MobileCommunityInfoActions community={community} />
            </SidebarSection>
          </InfoContainer>
        );
      }
      default:
        return null;
    }
  };

  /*
    Segments preserve scroll position when switched by default. We dont want
    this behavior - if you change the feed (eg threads => members) you should
    always end up at the top of the list. However, if the next active segment
    is chat, we want that scrolled to the bottom by default, since the behavior
    of chat is to scroll up for older messages
  */
  const { scrollToBottom, scrollToTop } = useAppScroller();
  useEffect(() => {
    if (tab === 'chat') {
      scrollToBottom();
    } else {
      scrollToTop();
    }
  }, [tab]);

  const segments = ['posts', 'members', 'info'];
  if (community.watercoolerId) segments.unshift('chat');

  // if the community being viewed changes, and the previous community had
  // a watercooler but the next one doesn't, select the posts tab on the new one
  useEffect(() => {
    handleTabRedirect();
  }, [community.slug]);

  return (
    <FeedsContainer data-cy="community-view-content">
      <SegmentedControl>
        {segments.map(segment => {
          return (
            <Segment
              key={segment}
              hideOnDesktop={segment === 'info'}
              isActive={segment === tab}
              onClick={() => changeTab(segment)}
            >
              {segment[0].toUpperCase() + segment.substr(1)}
            </Segment>
          );
        })}
      </SegmentedControl>
      {renderFeed()}
    </FeedsContainer>
  );
};

export const CommunityFeeds = compose(withRouter)(Feeds);
