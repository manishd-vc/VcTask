import React, { Component } from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import './SelectedSquad.css';
import SquadCard from '../SquadCard/SquadCard';

class SelectedSquad extends Component {
  render() {
    const { result, removeFunction } = this.props;
    return (
      <div className='SelectedSquadSection section'>
        <SectionTitle title='Selected Squad' />
        <div className='squadCardWrapper'>
          {result.map((item) => (
            <SquadCard
              key={item.id}
              pokemonImage={item.image}
              pokemonName={item.name}
              pokemonMoves={item.moves}
              removeFunction={removeFunction}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default SelectedSquad;
