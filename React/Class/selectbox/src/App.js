import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      states: [],
      cities: [],
      selectedCountry: '',
      selectedState: '',
    };
    this.changeCountry = this.changeCountry.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  componentDidMount() {
    this.setState({
      countries: [
        {
          name: 'india',
          states: [
            { name: 'gujarat', cities: ['Ahmadabad', 'Rajkot', 'Surat'] },
            { name: 'Rajasthan', cities: ['Pali', 'Jaipur', 'Abu'] },
          ],
        },
        {
          name: 'india2',
          states: [
            { name: 'gujarat2', cities: ['Ahmadabad2', 'Rajkot2', 'Surat2'] },
            { name: 'Rajasthan2', cities: ['Pali2', 'Jaipur2', 'Abu2'] },
          ],
        },
        {
          name: 'india3',
          states: [
            { name: 'gujarat3', cities: ['Ahmadabad3', 'Rajkot3', 'Surat3'] },
            { name: 'Rajasthan3', cities: ['Pali3', 'Jaipur3', 'Abu3'] },
          ],
        },
      ],
    });
  }

  changeCountry(event) {
    if (event.target.value === '') {
      this.setState({
        dataOfCity: [],
      });
    } else {
      this.setState({ selectedCountry: event.target.value });
      this.setState({
        states: this.state.countries.find(
          (item) => item.name === event.target.value
        ).states,
      });
    }
  }

  changeState(event) {
    if (event.target.value === '') {
      this.setState({
        dataOfCity: [],
      });
    } else {
      this.setState({ selectedState: event.target.value });
      const StateList = this.state.countries.find(
        (item) => item.name === this.state.selectedCountry
      ).states;
      this.setState({
        cities: StateList.find((item) => item.name === event.target.value)
          .cities,
      });
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='formGroup'>
          <label>Country</label>
          <select
            className='selectBox'
            placeholder='Country'
            value={this.state.selectedCountry}
            onChange={this.changeCountry}
          >
            <option value=''>Country</option>
            {this.state.countries.map((item, index) => (
              <option value={item.name} key={index}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className='formGroup'>
          <label>State</label>
          {console.log('this.state.states', this.state.states)}
          <select
            className='selectBox'
            placeholder='State'
            value={this.state.selectedState}
            onChange={this.changeState}
            disabled={!this.state.states.length > 0}
          >
            <option value=''>State</option>
            {this.state.states.map((item, index) => (
              <option value={item.name} key={index}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className='formGroup'>
          <label>City</label>
          <select
            className='selectBox'
            placeholder='City'
            disabled={!this.state.cities.length > 0}
          >
            <option value=''>City</option>
            {this.state.cities.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
export default App;
