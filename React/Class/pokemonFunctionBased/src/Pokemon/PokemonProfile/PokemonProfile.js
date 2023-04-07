import React from 'react'
// import Logo from './../../assets/pokeapiLogo.png';
import "./pokemonProfile.css"

const PokemonProfile = ({ pokemonImage }) => {
    return (
        <div className='PokemonProfile'>
            <img src={pokemonImage} alt="logo" />
        </div>
    )
}

export default PokemonProfile