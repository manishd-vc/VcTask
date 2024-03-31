import Style from './GoodsList.style';

function  GoodsList({list,deleteFunction}) {
  return (
    <div style={Style.listWrapper}>
      {list.map((item, index) => (
        <div className='listItem' style={Style.list} key={index}>
          <span style={Style.listText}> {item.name}</span>
          <span className='chip' style={Style.listChip}>
            {item.cost}
          </span>
          <button
            className='delete'
            style={Style.deleteButton}
            onClick={() => deleteFunction(item.id)}
          >
            delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default GoodsList;
