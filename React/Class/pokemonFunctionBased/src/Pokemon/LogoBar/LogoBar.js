import React from 'react'
import Logo from './../../assets/pokeapiLogo.png';
import "./logobar.css"

const LogoBar = () => {
    return (
        <div className='pokemonLogo'>
            <img src={Logo} alt="logo" />
        </div>
    )
}

export default LogoBar