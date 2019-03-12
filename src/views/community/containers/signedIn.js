// @flow
import React, { useState, useEffect } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import generateMetaInfo from 'shared/generate-meta-info';
import Icon from 'src/components/icons';
import getComposerLink from 'src/helpers/get-composer-link';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Head from 'src/components/head';
import Fab from 'src/components/fab';
import { CommunityProfileCard } from 'src/components/entities';
import { MobileCommunityTitlebar } from 'src/components/titlebar';
import type { SignedInMemberType } from '../types';
import { TeamMembersList } from '../components/teamMembersList';
import { CommunityFeeds } from '../components/communityFeeds';
import { ChannelsList } from '../components/channelsList';
import { SidebarSection } from '../style';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/layout';
import { RouteModalContext } from 'src/routes';

const Component = (props: SignedInMemberType) => {
  const { community } = props;

  let containerEl = null;

  useEffect(() => {
    containerEl = document.getElementById('scroller-for-thread-feed');
  }, []);

  const [metaInfo, setMetaInfo] = useState(
    generateMetaInfo({
      type: 'community',
      data: {
        name: community.name,
        description: community.description,
      },
    })
  );

  useEffect(
    () => {
      setMetaInfo(
        generateMetaInfo({
          type: 'community',
          data: {
            name: community.name,
            description: community.description,
          },
        })
      );
    },
    [community.id]
  );

  const { title, description } = metaInfo;

  const scrollToTop = () => {
    if (containerEl) return containerEl.scrollTo(0, 0);
  };

  const scrollToBottom = () => {
    if (containerEl) {
      containerEl.scrollTop =
        containerEl.scrollHeight - containerEl.clientHeight;
    }
  };

  const scrollToPosition = (position: number) => {
    if (containerEl) {
      containerEl.scrollTop = position;
    }
  };

  const contextualScrollToBottom = () => {
    if (
      containerEl &&
      containerEl.scrollHeight - containerEl.clientHeight <
        containerEl.scrollTop + 280
    ) {
      scrollToBottom();
    }
  };

  const { pathname, search } = getComposerLink({ communityId: community.id });

  return (
    <RouteModalContext.Consumer>
      {({ hasModal }) => (
        <React.Fragment>
          {community.communityPermissions.isMember && (
            <Fab
              title="New post"
              to={{
                pathname,
                search,
                state: { modal: true },
              }}
            >
              <Icon glyph={'post'} size={32} />
            </Fab>
          )}

          <ViewGrid data-cy="community-view">
            <Head
              title={title}
              description={description}
              image={community.profilePhoto}
            />

            <SecondaryPrimaryColumnGrid>
              <SecondaryColumn>
                <SidebarSection>
                  <CommunityProfileCard community={community} />
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
                  <ChannelsList
                    id={community.id}
                    communitySlug={community.slug}
                  />
                </SidebarSection>
              </SecondaryColumn>

              <PrimaryColumn>
                <MobileCommunityTitlebar community={community} />

                <CommunityFeeds
                  scrollToBottom={scrollToBottom}
                  contextualScrollToBottom={contextualScrollToBottom}
                  scrollToTop={scrollToTop}
                  scrollToPosition={scrollToPosition}
                  community={community}
                />
              </PrimaryColumn>
            </SecondaryPrimaryColumnGrid>
          </ViewGrid>
        </React.Fragment>
      )}
    </RouteModalContext.Consumer>
  );
};

export const SignedIn = compose(
  withCurrentUser,
  connect()
)(Component);
