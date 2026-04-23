import { useEffect } from "react";
import { useState } from "react"

export default function PokemonData() {
    const [pokemonList, setPokemonList] = useState([]);
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [currentPokemon, setCurrentPokemon] = useState('');
    const [cacheData, setCacheData] = useState({});


    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
            .then((res) => res.json())
            .then((data) => {
                console.log("data", data)
                setPokemonList(data.results)
            })
            .catch((err) => console.log('err', err))
    }, [])

    const handleChange = async (e) => {
        const value = e.target.value;
        setCurrentPokemon(value);

        if (cacheData[value]) {
            setPokemonDetails(cacheData[value])
        } else {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`);
                const data = await res.json();
                setCacheData((prev) => ({
                    ...prev,
                    [value]: data,
                }))
                setPokemonDetails(data);

            } catch {
                console.log("error", error)
            }
        }
    }
    console.log("pokemonDetails", pokemonDetails)
    console.log("cacheData", cacheData)
    return (
        <div>
            <select value="" onChange={handleChange}>
                <option value="" label="Select pokemon">Select pokemon</option>
                {pokemonList?.map((item) => {
                    return <option value={item.name} key={item.name}>{item.name}</option>
                })}
            </select>
            {pokemonDetails && (
                <div>{pokemonDetails.weight}</div>
            )}
        </div>
    )
}