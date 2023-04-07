
import React from 'react'
import SectionTitle from '../SectionTitle/SectionTitle'
import "./selectPokemon.css"

const SelectPokemon = ({ removeInput, onKeyDown, onChange, input, showSuggestions, SuggestionsListComponent }) => {


    return (
        <>
            <div className='SelectPokemonSection section'>
                <SectionTitle title="Select a Pokemon" />
                <div className='suggestionWrapper'>
                    <input
                        type="text"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        value={input}
                    />
                    {
                        input && <div className='closeButton' onClick={removeInput}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6 10.6 12 5 6.4 6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4Z" /></svg>
                        </div>
                    }

                    {showSuggestions && input && <SuggestionsListComponent />}
                </div>
            </div>

        </>
    );
}

export default SelectPokemon