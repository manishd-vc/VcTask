import React from 'react';
class Accordion extends React.Component {
  render() {
    const updateFunction = (id) => {
      const openItem = this.props.data.map((item, index) => {
        if (item.id === id) {
          return { ...item, open: !item.open };
        } else {
          return { ...item };
        }
      });
      this.props.updateStateData(openItem);
    };
    return (
      <div className='accordionMain'>
        {this.props.data.map((item, index) => (
          <div className='accordionItem' key={item.id}>
            <div className='accordionHead'>
              <div className='title'>{item.title}</div>
              <div className='icon' onClick={() => updateFunction(item.id)}>
                icon
              </div>
            </div>
            {item.open && (
              <div className='accordionContent'>{item.description}</div>
            )}
          </div>
        ))}
      </div>
    );
  }
}
export default Accordion;
