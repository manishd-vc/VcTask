import React, { Component } from 'react';
// import Logo from './../../assets/pokeapiLogo.png';
import './PokemonProfile.css';

class PokemonProfile extends Component {
  render() {
    return (
      <div className='PokemonProfile'>
        <img src={this.props.pokemonImage} alt='logo' />
      </div>
    );
  }
}

export default PokemonProfile;
