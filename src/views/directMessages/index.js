// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { ErrorView, LoadingView } from 'src/views/ViewHelpers';

/* prettier-ignore */
const DirectMessages = Loadable({
  loader: () => import('./containers/index.js'/* webpackChunkName: "DirectMessages" */),
  loading: ({ isLoading }) => isLoading && <LoadingView />,
});

export default DirectMessages;
