import React, { Component } from 'react';
import { PostWrapper, PostBody, PostImg, PostHeader, Avatar, UserMeta, Name, Meta, UpvoteWrapper, UpvoteButton } from './style';

class Post extends Component{
	render() {
		return (
	    	<PostWrapper>
	    		<PostHeader>
					  <Avatar src="./img/avatar.jpg" title="Bryn Jackson" />
					  <UserMeta>
					    <Name>Bryn Jackson</Name>
					    <Meta>Just now • No messages yet</Meta>
					  </UserMeta>
					  <UpvoteWrapper>
					  	<UpvoteButton>🔼 150</UpvoteButton>
					  </UpvoteWrapper>
					</PostHeader>
	    		<PostBody>
	    			<p>This is just a post with an image. Nothing super fancy or anything...</p>
	    			<PostImg src="/img/media.png" role="presentation"/>
	    		</PostBody>
    		</PostWrapper>
	  );
	}
}

export default Post;