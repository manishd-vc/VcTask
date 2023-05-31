import React, { Component } from 'react';
import './PokemonInfoCard.css';

class PokemonInfoCard extends Component {
  render() {
    const { InfoValue, InfoTitle } = this.props;
    return (
      <div className='PokemonInfoCard'>
        <div className='InfoValue'>{InfoValue}</div>
        <div className='InfoTitle'>{InfoTitle}</div>
      </div>
    );
  }
}

export default PokemonInfoCard;
