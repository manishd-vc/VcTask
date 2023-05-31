import React, { Component } from 'react';
import './FullWidthButton.css';

class FullWidthButton extends Component {
  render() {
    return (
      <button className='FullWidthButton' onClick={this.props.addSquad}>
        add to card
      </button>
    );
  }
}

export default FullWidthButton;
