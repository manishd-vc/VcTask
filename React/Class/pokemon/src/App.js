import React, { Component } from 'react';
import {
  LogoBar,
  SelectPokemon,
  SelectedPokemon,
  SelectedSquad,
} from './components';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      filteredSuggestions: [],
      activeSuggestionIndex: 0,
      showSuggestions: false,
      input: '',
      pokemonIndex: '',
      pokemonItems: [],
      pokemonImage: '',
      pokemonName: '',
      pokemonMoves: '',
      squadList: [],
    };
  }
  getPokemonUrl = () => {
    const { pokemonIndex } = this.state;
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`)
      .then((res) => res.json())
      .then((result) => {
        const name = result.stats.map((item) => item);
        this.setState({
          pokemonItems: name,
          pokemonImage: result.sprites.other.dream_world.front_default,
          pokemonName: result.name,
          pokemonMoves: result.moves[0].move.name,
        });
      });
  };
  componentDidMount() {
    fetch('https://pokeapi.co/api/v2/pokemon/')
      .then((res) => res.json())
      .then((result) => {
        const name = result.results.map((item) => item.name);
        this.setState({ items: name });
      });
  }

  removeInput = () => {
    this.setState({
      input: '',
      filteredSuggestions: [],
      activeSuggestionIndex: 0,
      showSuggestions: false,
      pokemonIndex: '',
    });
  };

  onKeyDown = (event) => {
    const { filteredSuggestions, activeSuggestionIndex, items } = this.state;
    if (event.keyCode === 13) {
      this.setState(
        {
          input: filteredSuggestions[activeSuggestionIndex],
          filteredSuggestions: [],
          activeSuggestionIndex: 0,
          showSuggestions: false,
          pokemonIndex:
            items.indexOf(filteredSuggestions[activeSuggestionIndex]) + 1,
          pokemonImage:
            items.indexOf(filteredSuggestions[activeSuggestionIndex]) + 1,
        },
        () => {
          this.getPokemonUrl();
        }
      );
    }
    // User pressed the up arrow
    else if (event.keyCode === 38) {
      if (activeSuggestionIndex === 0) {
        return;
      }
      this.setState({
        activeSuggestionIndex: activeSuggestionIndex - 1,
      });
    }
    // User pressed the down arrow
    else if (event.keyCode === 40) {
      if (activeSuggestionIndex - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({
        activeSuggestionIndex: activeSuggestionIndex + 1,
      });
    }
  };

  onChange = (event) => {
    const userInput = event.target.value;

    // Filter our items that don't contain the user's input
    const unLinked = this.state.items.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    this.setState({
      input: event.target.value,
      filteredSuggestions: unLinked,
      activeSuggestionIndex: 0,
      showSuggestions: true,
    });
  };

  suggestionClick = (event) => {
    this.setState(
      {
        filteredSuggestions: [],
        input: event.target.innerText,
        activeSuggestionIndex: 0,
        showSuggestions: false,
        pokemonIndex: this.state.items.indexOf(event.target.innerText) + 1,
      },
      () => {
        this.getPokemonUrl();
      }
    );
  };

  SuggestionsListComponent = () => {
    const { filteredSuggestions, activeSuggestionIndex } = this.state;
    return filteredSuggestions.length ? (
      <ul className='items'>
        {filteredSuggestions.map((suggestion, index) => {
          let className;

          // Flag the active suggestion with a class
          if (index === activeSuggestionIndex) {
            className = 'suggestion-active';
          }

          return (
            <li
              className={className}
              key={suggestion}
              onClick={this.suggestionClick}
            >
              {suggestion}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className='no-suggestions'>
        <span role='img' aria-label='tear emoji'>
          😪
        </span>
        <em>sorry no suggestions</em>
      </div>
    );
  };

  addSquad = () => {
    const { squadList, pokemonName, pokemonMoves, pokemonImage } = this.state;
    const currentSquad = {
      name: pokemonName,
      moves: pokemonMoves,
      image: pokemonImage,
      id: pokemonName,
    };
    const isAvailable = squadList.find((element) => {
      if (element.name === currentSquad.name) {
        window.alert('already in the list');
        return true;
      } else if (squadList.length > 5) {
        window.alert('you have entered your maximum limit');
        return true;
      } else {
        return false;
      }
    });

    if (!isAvailable) {
      this.setState({
        squadList: [...squadList, currentSquad],
      });
    }
  };

  removeSquad = (name) => {
    console.log('squadList', this.state.squadList);
    const updatedSquad = this.state.squadList.filter(
      (item) => item.name !== name
    );
    console.log('updatedSquad', updatedSquad);
    this.setState({
      squadList: [...updatedSquad],
    });
  };

  render() {
    const { pokemonIndex, pokemonItems, pokemonImage, pokemonName, squadList } =
      this.state;
    return (
      <div>
        <LogoBar />
        <SelectPokemon
          removeInput={this.removeInput}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          input={this.state.input}
          showSuggestions={this.state.showSuggestions}
          SuggestionsListComponent={this.SuggestionsListComponent}
        />
        {pokemonIndex && (
          <SelectedPokemon
            pokemonIndex={pokemonIndex}
            addSquad={this.addSquad}
            pokemonItems={pokemonItems}
            pokemonImage={pokemonImage}
            pokemonName={pokemonName}
          />
        )}
        {squadList.length > 0 && (
          <SelectedSquad result={squadList} removeFunction={this.removeSquad} />
        )}
      </div>
    );
  }
}
export default App;
