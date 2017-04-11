import styled from 'styled-components';

export const Body = styled.div`
  background: #f6f7f8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  height: 100%;
	overflow-y: hidden;

  @media (max-width: 768px) {
    overflow-x: hidden;
  }
`;

export const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

export const VerticalSpacer = styled.div`
  display: block;
  min-height: 48px;
`;

export const ScrollBody = styled.div`
  display: flex;
  position: relative;
  max-height: 100%;
  overflow-y: scroll;

  @media (max-width: 768px) {
    flex: 1 0 auto;
    width: 100%;
  }
`;

export const LeftColumnContainer = styled(ScrollBody)`
  background: ${({ theme }) => theme.bg.reverse};
  flex: 0 0 256px;
  z-index: 2;

  @media (max-width: 768px) {
    transform: translateX( ${props =>
  props.viewing === 'frequencies' ? '0' : '-100%'} )
  }
`;

export const MiddleColumnContainer = styled(ScrollBody)`
  background: ${({ theme }) => theme.bg.wash};
  border-right: 1px solid ${({ theme }) => theme.border.default};
  flex: 0 0 480px;
  z-index: 1;
  overflow-y: hidden;

  @media (max-width: 768px) {
    position: ${props => props.absolute ? 'absolute' : 'relative'};
    border-right: 0;
    transform: translateX( -100% );
  }
`;

export const RightColumnContainer = styled(ScrollBody)`
  background-color: #fff;
  flex: 1 1 auto;
  z-index: 2;
  overflow: hidden;

  @media (max-width: 768px) {
    transform: translateX(
      ${props =>
  props.active || props.viewing === 'detail'
    ? '-200%'
    : `${props.viewing === 'messageGroup'}` ? '-100%' : '-100%'});
    overflow-y: hidden;
  }
`;
