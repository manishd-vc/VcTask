import React from 'react'
import SectionTitle from '../SectionTitle/SectionTitle'
import SquadCard from '../SquadCard/SquadCard'
import "./selectedSquad.css"

const SelectedSquad = ({ result }) => {
    console.log(result)
    return (
        <div className='SelectedSquadSection section'>
            <SectionTitle title="Selected Squad" />
            <div className="squadCardWrapper">
                {result.map((item) =>
                    <SquadCard key={item.id}
                        pokemonImage={item.image} pokemonName={item.name} pokemonMoves={item.moves} />
                )}
            </div>
        </div>
    )
}

export default SelectedSquad