import React, { Component } from 'react';
import Logo from './../../assets/pokeapiLogo.png';
import './logoBar.css';

class LogoBar extends Component {
  render() {
    return (
      <div className='pokemonLogo'>
        <img src={Logo} alt='logo' />
      </div>
    );
  }
}
export default LogoBar;
