import React, { Component } from 'react';
import './SelectedPokemon.css';
import SectionTitle from '../SectionTitle/SectionTitle';
import PokemonProfile from '../PokemonProfile/PokemonProfile';
import PokemonInfoCard from '../PokemonInfoCard/PokemonInfoCard';
import FullWidthButton from '../FullWidthButton/FullWidthButton';

class SelectedPokemon extends Component {
  render() {
    const { pokemonIndex, addSquad, pokemonItems, pokemonImage, pokemonName } =
      this.props;
    return (
      <div className='SelectedPokemonSection section'>
        <SectionTitle title='Selected Pokemon' />
        <div className='pokemonImage'>
          <PokemonProfile pokemonImage={pokemonImage} />
        </div>
        <SectionTitle title={pokemonName} />
        {pokemonIndex && (
          <div className='pokemonInfo'>
            {pokemonItems.map((item, index) => (
              <PokemonInfoCard
                key={index}
                InfoValue={item.base_stat}
                InfoTitle={item.stat.name}
              />
            ))}
          </div>
        )}
        <FullWidthButton addSquad={addSquad} />
      </div>
    );
  }
}

export default SelectedPokemon;
