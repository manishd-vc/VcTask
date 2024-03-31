import React, { Component } from 'react';
import PokemonProfile from '../PokemonProfile/PokemonProfile';
import './SquadCard.css';

class SquadCard extends Component {
  render() {
    const { pokemonImage, pokemonName, pokemonMoves, removeFunction } =
      this.props;
    return (
      <div className='SquadCard'>
        <div className='pokemonImage'>
          <PokemonProfile pokemonImage={pokemonImage} />
        </div>
        <div className='pokemonName'>{pokemonName}</div>
        <div className='pokemonMoves'>{pokemonMoves}</div>
        <div
          className='removeButton'
          onClick={() => removeFunction(pokemonName)}
        >
          X
        </div>
      </div>
    );
  }
}

export default SquadCard;
