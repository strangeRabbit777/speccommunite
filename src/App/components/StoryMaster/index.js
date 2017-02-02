import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Column, Header, ScrollBody, JoinBtn} from './style';
import { toggleComposer } from '../../../actions/composer'
import { unsubscribeFrequency, subscribeFrequency } from '../../../actions/frequencies'
import Story from '../Story';
import Composer from '../Composer';

class StoryMaster extends Component{
  toggleComposer = () => {
    this.props.dispatch(toggleComposer())
  }

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency())
  }

  subscribeFrequency = () => {
    this.props.dispatch(subscribeFrequency())
  }

	render() {
    let stories = this.props.stories.stories
    let subscribeButton = (usersFrequencies, activeFrequency) => {
      if (!usersFrequencies && activeFrequency !== "all" && activeFrequency !== null) {
        return <JoinBtn onClick={ this.subscribeFrequency }>Join</JoinBtn>
      } else if (activeFrequency === "all" || activeFrequency === null) {
        return ''
      } else if (usersFrequencies.indexOf(activeFrequency) > -1) {
        return <JoinBtn member onClick={ this.unsubscribeFrequency }>Leave</JoinBtn>
      } else if (!activeFrequency) {
        return ''
      } else {
        return <JoinBtn onClick={ this.subscribeFrequency }>Join</JoinBtn>
      }
    }

		return (
	    	<Column >

          <Header>
            <img src="/img/add-story.svg" onClick={ this.toggleComposer } alt="Add Story Button"/>
            { subscribeButton(this.props.user.frequencies, this.props.frequencies.active) }
          </Header>

          {/*<ComposerOverlay onClick={ this.toggleComposer } isOpen={ this.props.composer.isOpen } />
          <Composer isOpen={ this.props.composer.isOpen } />*/}

          <ScrollBody>
            <Composer isOpen={ this.props.composer.isOpen } />
            { stories.length > 0 &&
              // slice and reverse makes sure our stories show up in revers chron order
              stories.slice(0).reverse().map((story, i) => {
                return <Story data={story} key={i} />
              }) 
            }
            <img src="/img/add-story_secondary.svg" onClick={ this.toggleComposer } alt="Add Story Button"/>
          </ScrollBody>
	    	</Column>
	  );
	}
}

const mapStateToProps = (state) => {
  return {
    stories: state.stories,
    frequencies: state.frequencies,
    composer: state.composer,
    user: state.user
  }
}

export default connect(mapStateToProps)(StoryMaster);