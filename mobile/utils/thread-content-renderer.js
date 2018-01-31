// @flow
import React from 'react';
import { FlatList, WebView } from 'react-native';
import styled from 'styled-components/native';
import redraft from 'redraft';
import Anchor from '../components/Anchor';
import Text from '../components/Text';
import Codeblock from '../components/Codeblock';
import IFrame from '../components/IFrame';

const renderer = {
  inline: {
    BOLD: (children, { key }) => (
      <Text bold key={`bold-${key}`}>
        {children}
      </Text>
    ),
    ITALIC: (children, { key }) => (
      <Text italic key={`italic-${key}`}>
        {children}
      </Text>
    ),
    UNDERLINE: (children, { key }) => (
      <Text underline key={`underline-${key}`}>
        {children}
      </Text>
    ),
    CODE: (children, { key }) => (
      <Codeblock key={`codeblock-${key}`}>{children}</Codeblock>
    ),
  },
  entities: {
    // key is the entity key value from raw
    LINK: (children, data, { key }) => (
      <Anchor key={key} href={data.url}>
        {children}
      </Anchor>
    ),
    embed: (children, { src }, { key }) => {
      return <IFrame key={key} src={src} />;
    },
  },
  blocks: {
    unstyled: (children, { keys }) =>
      children.map((child, index) => (
        <Text type="body" key={keys[index] || index}>
          {child}
        </Text>
      )),
    // Note: Headings are offset by one because we always assume the title
    // of the thread to be level 1, so a level 1 heading inside the thread
    // body has to be level 2
    'header-one': (children, { keys }) =>
      children.map((child, index) => (
        <Text type="title2" key={keys[index] || index}>
          {child}
        </Text>
      )),
    'header-two': (children, { keys }) =>
      children.map((child, index) => (
        <Text type="title3" key={keys[index] || index}>
          {child}
        </Text>
      )),
    // blockquote: (children, { keys }) =>
    // 'code-block': (children, { keys }) =>
    'unordered-list-item': (children, { depth, keys }) => {
      return (
        <FlatList
          data={children}
          key={keys[keys.length - 1]}
          keyExtractor={(_, index) => keys[index]}
          renderItem={({ item, index }) => (
            <Text type="body">
              {'\u2022'} {item}
            </Text>
          )}
        />
      );
    },
    'ordered-list-item': (children, { depth, keys }) => {
      return (
        <FlatList
          data={children}
          key={keys.join('|')}
          keyExtractor={(_, index) => keys[index]}
          renderItem={({ item, index }) => (
            <Text type="body">
              {index}. {item}
            </Text>
          )}
        />
      );
    },
    'code-block': (children, { keys }) => (
      <Codeblock key={keys.join('|')}>{children}</Codeblock>
    ),
  },
};

export default (rawContentState: Object) => redraft(rawContentState, renderer);
