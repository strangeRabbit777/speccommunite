// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';

export const NAVBAR_WIDTH = isDesktopApp() ? 80 : 72;
export const PRIMARY_COLUMN_WIDTH = 600;
export const SECONDARY_COLUMN_WIDTH = 340;
export const COL_GAP = 16;
export const TITLEBAR_HEIGHT = 62;
export const MAX_WIDTH =
  PRIMARY_COLUMN_WIDTH + SECONDARY_COLUMN_WIDTH + COL_GAP;
export const SINGLE_COLUMN_WIDTH = MAX_WIDTH;
// add 144 (72 * 2) to account for the left side nav
export const MEDIA_BREAK =
  PRIMARY_COLUMN_WIDTH + SECONDARY_COLUMN_WIDTH + COL_GAP + NAVBAR_WIDTH * 2;

/* 
  do not remove this className.
  see `src/routes.js` for an explanation of what's going on here
*/
export const ViewGrid = styled.main.attrs({
  id: 'main',
  className: 'view-grid',
})`
  display: grid;
  grid-area: main;
  max-height: 100vh;
  overflow: hidden;
  overflow-y: scroll;

  @media (max-width: ${MEDIA_BREAK}px) {
    max-height: calc(100vh - ${TITLEBAR_HEIGHT}px);
  }
`;

/*
┌──┬────────┬──┐
│  │   xx   │  │
│  │        │  │
│  │   xx   │  │
│  │        │  │
│  │   xx   │  │
└──┴────────┴──┘
*/
export const SingleColumnGrid = styled.div`
  display: grid;
  justify-self: center;
  grid-template-columns: minmax(${MAX_WIDTH}px, 1fr);
  background: ${theme.bg.default};
  max-width: calc(${MAX_WIDTH}px + 2px); /* left/right border */
  border-left: 1px solid ${theme.bg.border};
  border-right: 1px solid ${theme.bg.border};

  @media (max-width: ${MEDIA_BREAK}px) {
    width: 100%;
    max-width: ${MEDIA_BREAK}px;
    border-left: 0;
    border-right: 0;
  }
`;

/*
┌──┬────┬─┬─┬──┐
│  │ xx │ │x│  │
│  │    │ │ │  │
│  │ xx │ │x│  │
│  │    │ │ │  │
│  │ xx │ │x│  │
└──┴────┴─┴─┴──┘
*/
export const PrimarySecondaryColumnGrid = styled.div`
  display: grid;
  justify-self: center;
  grid-template-columns: ${PRIMARY_COLUMN_WIDTH}px ${SECONDARY_COLUMN_WIDTH}px;
  grid-template-rows: 100%;
  grid-template-areas: 'primary secondary';
  grid-gap: ${COL_GAP}px;
  max-width: ${MAX_WIDTH}px;

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
    grid-gap: 0;
    min-width: 100%;
  }
`;

/*
┌──┬─┬─┬────┬──┐
│  │x│ │ xx │  │
│  │ │ │    │  │
│  │x│ │ xx │  │
│  │ │ │    │  │
│  │x│ │ xx │  │
└──┴─┴─┴────┴──┘
*/
export const SecondaryPrimaryColumnGrid = styled.div`
  display: grid;
  justify-self: center;
  grid-template-columns: ${SECONDARY_COLUMN_WIDTH}px ${PRIMARY_COLUMN_WIDTH}px;
  grid-template-rows: 100%;
  grid-template-areas: 'secondary primary';
  grid-gap: ${COL_GAP}px;
  max-width: ${MAX_WIDTH}px;

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
    grid-gap: 0;
    min-width: 100%;
    max-width: 100%;
  }
`;

/*
┌─────────────┐
│             │
│    ┌───┐    │
│    │ x │    │
│    └───┘    │
│             │
└─────────────┘
*/
export const CenteredGrid = styled(SingleColumnGrid)`
  align-self: center;
  max-width: ${PRIMARY_COLUMN_WIDTH}px;

  @media (max-width: ${PRIMARY_COLUMN_WIDTH + NAVBAR_WIDTH}px) {
    align-self: start;
  }
`;

export const PrimaryColumn = styled.section`
  background: ${theme.bg.default};
  border-left: 1px solid ${theme.bg.border};
  border-right: 1px solid ${theme.bg.border};
  border-bottom: 1px solid ${theme.bg.border};
  border-radius: 0 0 4px 4px;
  height: 100%;
  min-width: 100%;
  grid-area: primary;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    grid-column-start: 1;
  }
`;

export const SecondaryColumn = styled.section`
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  position: sticky;
  top: 0;
  padding-bottom: 48px;
  padding-right: 12px;
  grid-area: secondary;

  @media (max-width: ${MEDIA_BREAK}px) {
    height: calc(100vh - ${TITLEBAR_HEIGHT}px);
    display: none;
  }
`;

export const ChatInputWrapper = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: 3000;

  @media (max-width: ${MEDIA_BREAK}px) {
    width: 100vw;
    position: fixed;
    bottom: 0;
  }
`;
