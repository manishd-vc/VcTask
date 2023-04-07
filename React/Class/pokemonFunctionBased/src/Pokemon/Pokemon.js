
import React, { useEffect, useState } from 'react'
import LogoBar from './LogoBar/LogoBar'
import SelectedPokemon from './SelectedPokemon/SelectedPokemon'
import SelectedSquad from './SelectedSquad/SelectedSquad'
import SelectPokemon from './SelectPokemon/SelectPokemon'
import "./pokemon.css"

const Pokemon = () => {
    const [items, setItems] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [input, setInput] = useState("");
    const [pokemonIndex, setPokemonIndex] = useState("");
    const [pokemonItems, setPokemonItems] = useState([]);
    const [pokemonImage, setpokemonImage] = useState("");
    const [pokemonName, setPokemonName] = useState("");
    const [pokemonMoves, setPokemonMovese] = useState("");
    const [squadList, setSquadList] = useState([]);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon/")
            .then(res => res.json())
            .then(
                (result) => {
                    const name = result.results.map((item) => item.name)
                    setItems(name);
                },
            )
    }, [])
    useEffect(() => {
        console.log("itemsurl", `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`)
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`)
            .then(res => res.json())
            .then(
                (result) => {
                    const name = result.stats.map((item) => item)
                    setPokemonItems(name);
                    setpokemonImage(result.sprites.other.dream_world.front_default);
                    setPokemonName(result.name);
                    setPokemonMovese(result.moves[0].move.name);

                },
            )

        console.log("items", pokemonItems)
    }, [pokemonIndex])
    const onChange = (event) => {
        const userInput = event.target.value;

        // Filter our items that don't contain the user's input
        const unLinked = items.filter(
            (suggestion) =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        setInput(event.target.value);
        setFilteredSuggestions(unLinked);
        setActiveSuggestionIndex(0);
        setShowSuggestions(true);
    };

    const onClick = (event) => {
        setFilteredSuggestions([]);
        setInput(event.target.innerText);
        setActiveSuggestionIndex(0);
        setShowSuggestions(false);
        setPokemonIndex(items.indexOf(event.target.innerText) + 1)
    };
    const removeInput = () => {
        setInput("");
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(0);
        setShowSuggestions(false);
        setPokemonIndex("");
    }
    const onKeyDown = (event) => {
        // User pressed the enter key
        if (event.keyCode === 13) {
            setInput(filteredSuggestions[activeSuggestionIndex]);
            setActiveSuggestionIndex(0);
            setShowSuggestions(false);
            setPokemonIndex(items.indexOf(filteredSuggestions[activeSuggestionIndex]) + 1)
        }
        // User pressed the up arrow
        else if (event.keyCode === 38) {
            if (activeSuggestionIndex === 0) {
                return;
            }

            setActiveSuggestionIndex(activeSuggestionIndex - 1);
        }
        // User pressed the down arrow
        else if (event.keyCode === 40) {
            if (activeSuggestionIndex - 1 === filteredSuggestions.length) {
                return;
            }

            setActiveSuggestionIndex(activeSuggestionIndex + 1);
        }
    };

    const SuggestionsListComponent = () => {
        return filteredSuggestions.length ? (
            <ul class="items">
                {filteredSuggestions.map((suggestion, index) => {
                    let className;

                    // Flag the active suggestion with a class
                    if (index === activeSuggestionIndex) {
                        className = "suggestion-active";
                    }

                    return (
                        <li className={className} key={suggestion} onClick={onClick}>
                            {suggestion}
                        </li>
                    );
                })}
            </ul>
        ) : (
            <div class="no-suggestions">
                <span role="img" aria-label="tear emoji">
                    😪
                </span>
                <em>sorry no suggestions</em>
            </div>
        );
    };
    const addSquad = () => {
        setSquadList(squadList => [...squadList, { name: pokemonName, moves: pokemonMoves, image: pokemonImage, id: pokemonName }]);
    }
    console.log("squadList", squadList);
    return (
        <div className='pokemonMain'>
            <div className='container'>
                <LogoBar />
                <SelectPokemon removeInput={removeInput} onKeyDown={onKeyDown} onChange={onChange} input={input} showSuggestions={showSuggestions} SuggestionsListComponent={SuggestionsListComponent} />
                {pokemonIndex && <SelectedPokemon pokemonIndex={pokemonIndex} addSquad={addSquad} pokemonItems={pokemonItems} pokemonImage={pokemonImage} pokemonName={pokemonName} />}
                {squadList.length > 0 && <SelectedSquad result={squadList} />}

            </div>
        </div >
    )
}

export default Pokemon