// @flow
import React from 'react';
import { TextInput, View } from 'react-native';
import Text from '../../components/Text';
import TouchableHighlight from '../../components/TouchableHighlight';
import ChatInput from '../../components/ChatInput';
import { FullscreenNullState } from '../../components/NullStates';
import PeopleSearchView from '../Search/PeopleSearchView';
import createDirectMessageThread, {
  type CreateDirectMessageThreadProps,
} from '../../../shared/graphql/mutations/directMessageThread/createDirectMessageThread';
import { getUserById } from '../../../shared/graphql/queries/user/getUser';
import {
  ComposerWrapper,
  SearchInputArea,
  SelectedUsers,
  SelectedUserPill,
} from './style';
import type { NavigationProps } from 'react-navigation';
import type { ComponentType } from 'react';

const SelectedUser: ComponentType<{
  id: string,
  onPressHandler: Function,
}> = getUserById(({ data, onPressHandler }) => {
  if (data.user)
    return (
      <TouchableHighlight onPress={onPressHandler}>
        <SelectedUserPill>
          <Text
            type="body"
            style={{ marginTop: 0, fontSize: 14 }}
            color={props => props.theme.brand.default}
          >
            {data.user.name}
            {'  ✕'}
          </Text>
        </SelectedUserPill>
      </TouchableHighlight>
    );

  return null;
});

type Props = {
  ...$Exact<NavigationProps>,
  ...$Exact<CreateDirectMessageThreadProps>,
};

type State = {
  wipSearchString: string,
  searchString: string,
  selectedUsers: string[],
};

class DirectMessageComposer extends React.Component<Props, State> {
  state = {
    wipSearchString: '',
    searchString: '',
    selectedUsers: [],
  };

  searchInput: {
    focus: () => void,
  };

  onChangeText = (text: string) => {
    this.setState({
      wipSearchString: text,
    });
  };

  onFinishTyping = (e: { nativeEvent: { text: string } }) => {
    this.setState({
      searchString: e.nativeEvent.text,
    });
  };

  selectUser = (userId: string) => {
    this.setState(prev => ({
      selectedUsers: prev.selectedUsers.concat([userId]),
      wipSearchString: '',
      searchString: '',
    }));
    this.searchInput && this.searchInput.focus();
  };

  removeSelectedUser = (userId: string) => () => {
    this.setState(prev => ({
      selectedUsers: prev.selectedUsers.filter(
        selectedId => selectedId !== userId
      ),
    }));
  };

  onSubmit = (text: string) => {
    if (this.state.selectedUsers.length === 0) return;
    this.props
      .createDirectMessageThread({
        participants: this.state.selectedUsers,
        message: {
          messageType: 'text',
          threadType: 'directMessageThread',
          content: {
            body: text,
          },
        },
      })
      .then(result => {
        this.props.navigation.navigate('DirectMessageThread', {
          id: result.data.createDirectMessageThread.id,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    return (
      <ComposerWrapper>
        <SearchInputArea>
          <SelectedUsers empty={this.state.selectedUsers.length === 0}>
            {this.state.selectedUsers.map(userId => (
              <SelectedUser
                key={userId}
                id={userId}
                onPressHandler={this.removeSelectedUser(userId)}
              />
            ))}
          </SelectedUsers>
          <TextInput
            onChangeText={this.onChangeText}
            onEndEditing={this.onFinishTyping}
            onSubmitEditing={this.onFinishTyping}
            value={this.state.wipSearchString}
            returnKeyType="search"
            autoFocus
            ref={elem => (this.searchInput = elem)}
            style={{ fontSize: 18, margin: 8 }}
          />
        </SearchInputArea>
        {!this.state.searchString ? (
          <FullscreenNullState
            title={'Send Direct Messages'}
            subtitle={
              'Direct messages are private conversations between you and anyone else, including groups. Search for a person above to get started.'
            }
            icon={'message-new'}
          />
        ) : (
          <PeopleSearchView
            onPress={this.selectUser}
            queryString={this.state.searchString}
          />
        )}
        <ChatInput onSubmit={this.onSubmit} />
      </ComposerWrapper>
    );
  }
}

export default createDirectMessageThread(DirectMessageComposer);
