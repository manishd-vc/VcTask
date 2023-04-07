import React from "react";
import FullWidthButton from "../FullWidthButton/FullWidthButton";
import PokemonInfoCard from "../PokemonInfoCard/PokemonInfoCard";
import PokemonProfile from "../PokemonProfile/PokemonProfile";
import SectionTitle from "../SectionTitle/SectionTitle";
import "./selectedPokemon.css"

const SelectedPokemon = ({ pokemonIndex, addSquad, pokemonItems, pokemonImage, pokemonName }) => {


    return (
        <div className="SelectedPokemonSection section">
            <SectionTitle title="Selected Pokemon" />
            <div className="pokemonImage">
                <PokemonProfile pokemonImage={pokemonImage} />
            </div>
            <SectionTitle title={pokemonName} />
            {pokemonIndex &&
                <div className="pokemonInfo">
                    {pokemonItems.map((item, index) =>
                        <PokemonInfoCard key={index}
                            InfoValue={item.base_stat} Infotitle={item.stat.name} />
                    )}
                </div>
            }
            <FullWidthButton addSquad={addSquad} />
        </div>
    );

}
export default SelectedPokemon;