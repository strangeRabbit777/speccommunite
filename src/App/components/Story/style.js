import styled from 'styled-components';

export const StoryWrapper = styled.div`
	display: inline-block;
	margin: 8px;
	margin-bottom: 0;
	flex: 0 0 auto;
	padding: 16px;
	border-radius: 2px;
	background-color: #ffffff;
	transition: box-shadow 0.2s ease-in;
	box-shadow: ${props => props.selected ? '0 2px 4px rgba(129, 148, 175, 0.2)' : '0 2px 8px rgba(73, 92, 240, 0.8)'};

	&:hover {
		box-shadow: 0 4px 16px rgba(129, 148, 175, 0.8);
		transition: box-shadow 0.2s ease-out;
		cursor: pointer;
	}
`;

export const StoryBody = styled.div`
	display: inline-block;
	margin-top: 16px;
	font-size: 14px;
`;

export const Avatar = styled.img`
	display: inline-block;
  height: 40px;
  width: 40px;
	border-radius: 12px;
	box-shadow: 0 0 1px rgba(0,0,0,0.3);
`;

export const StoryHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.p`
	font-size: 14px;
	font-weight: bold;
	margin-bottom: 8px;
`;

export const Desc = styled.p`
	font-size: 14px;
	font-weight: regular;
	margin-bottom: 8px;
`;

export const Media = styled.img`
	width: 100%;
	margin: 8px 8px 0 0;
	border-radius: 4px;
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  flex: 1 0 auto;
`;

export const Name = styled.h3`
  font-size: 14px;
  color: #43484F;
  font-weight: 600;
`;

export const Meta = styled.h4`
  font-size: 12px;
  color: #747E8D;
  font-weight: 400;
`;

export const UpvoteWrapper = styled.div`
	display: flex;
	justify-self: end;
	flex: 0 0 auto;
`;

export const UpvoteButton = styled.div`
	justify-self: start;
	font-weight: 700;
`;