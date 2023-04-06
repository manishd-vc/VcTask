import react from 'react';
import Style from './Search.style';

class Search extends react.Component {
  render() {
    return (
      <input
        type='text'
        placeholder='Type to search...'
        style={Style.search}
        onChange={(event) => this.props.searchFunction(event.target.value)}
      />
    );
  }
}
export default Search;
