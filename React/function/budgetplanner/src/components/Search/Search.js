import Style from './Search.style';

function  Search({searchFunction}) {
  return (
    <input
      type='text'
      placeholder='Type to search...'
      style={Style.search}
      onChange={(event) => searchFunction(event.target.value)}
    />
  );
}

export default Search;
