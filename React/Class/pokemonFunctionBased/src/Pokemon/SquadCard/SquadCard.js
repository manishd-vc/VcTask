import React from 'react'
import PokemonProfile from '../PokemonProfile/PokemonProfile'
import "./squadCard.css"

const SquadCard = ({ pokemonImage, pokemonName, pokemonMoves }) => {
    return (
        <div className='SquadCard'>
            <div className="pokemonImage">
                <PokemonProfile pokemonImage={pokemonImage} />
            </div>
            <div className="pokemonName">{pokemonName}</div>
            <div className="pokemonMoves">{pokemonMoves}</div>
        </div>
    )
}

export default SquadCard