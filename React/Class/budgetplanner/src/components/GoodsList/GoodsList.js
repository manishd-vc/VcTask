import react from 'react';
import Style from './GoodsList.style';

class GoodsList extends react.Component {
  render() {
    return (
      <div style={Style.listWrapper}>
        {this.props.list.map((item, index) => (
          <div className='listItem' style={Style.list} key={index}>
            <span style={Style.listText}> {item.name}</span>
            <span className='chip' style={Style.listChip}>
              {item.cost}
            </span>
            <button
              className='delete'
              style={Style.deleteButton}
              onClick={() => this.props.deleteFunction(item.id)}
            >
              delete
            </button>
          </div>
        ))}
      </div>
    );
  }
}
export default GoodsList;
