import React from 'react'
import "./pokemonInfoCard.css"

const PokemonInfoCard = ({ InfoValue, Infotitle }) => {
    return (
        <div className='PokemonInfoCard'>
            <div className='InfoValue'>{InfoValue}</div>
            <div className='Infotitle'>{Infotitle}</div>
        </div>
    )
}

export default PokemonInfoCard