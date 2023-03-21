import React from "react";
const countries =
{
  india: {
    gujarat: ["gujarat1", "gujarat2", "gujarat3"],
    rajasthan: ["rajasthan1", "rajasthan2", "rajasthan3"],
    maharashtra: ["maharashtra1", "maharashtra2", "maharashtra3"]
  },
  UnitedStates: {
    Alabama: ["Arizona1", "Arizona2", "Arizona3"],
    Alaska: ["Alaska1", "Alaska2", "Alaska3"],
    Arizona: ["Arizona1", "Arizona2", "Arizona3"]
  }
}

const countriesList = Object.keys(countries);
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedState: '',
      selectedCountry: '',
      selectedCity: '',
      dataOfCountry: countriesList,
      dataOfState: [],
      dataOfCity: [],
    };
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  handleCountryChange(event) {
    if (event.target.value === "") {
      this.setState({
        dataOfState: []
      })
    } else {
      this.setState({ selectedCountry: event.target.value }, () => {
        const selectedDataOfCountry = countries[this.state.selectedCountry]
        const dataOfStateList = Object.keys(selectedDataOfCountry);

        this.setState(
          {
            dataOfState: dataOfStateList
          }
        )
      });
    }
  }
  handleStateChange(event) {
    if (event.target.value === "") {
      this.setState({
        dataOfCity: []
      })
    } else {
      this.setState({ selectedState: event.target.value }, () => {
        const selectedDataOfState = this.state.selectedState
        const dataOfCityList = countries[this.state.selectedCountry]?.[selectedDataOfState];
        this.setState(
          {
            dataOfCity: dataOfCityList
          }
        )
      });
    }
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <select value={this.state.selectedCountry} onChange={this.handleCountryChange}>
          <option value="">select option</option>
          {this.state.dataOfCountry.map((item, index) => (
            <option value={item} key={index}>{item}</option>
          ))}
        </select>
        {console.log("this.state.dataOfState", this.state.dataOfState)}
        <select value={this.state.selectedState} onChange={this.handleStateChange} >
          <option value="">select option</option>
          {this.state.dataOfState.map((item, index) => (
            <option value={item} key={index}>{item}</option>
          ))}
        </select>
        <select value={this.state.selectedCity} >
          <option value="">select option</option>
          {this.state.dataOfCity.map((item, index) => (
            <option value={item} key={index}>{item}</option>
          ))}
        </select>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default App;
