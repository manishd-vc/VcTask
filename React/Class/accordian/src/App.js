import React from 'react';
import './App.css';
import Accordion from './components/accordian';

const data = [
  {
    title: 'accordion 1 Lorem Ipsum is simply dummy',
    description:
      "accordion 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
  },
  {
    title: 'accordion 2 Lorem Ipsum is simply dummy',
    description:
      "accordion 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
  },
  {
    title: 'accordion 3 Lorem Ipsum is simply dummy',
    description:
      "accordion 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
  },
  {
    title: 'accordion 4 Lorem Ipsum is simply dummy',
    description:
      "accordion 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accordionData: [],
    };
    this.openItem = this.openItem.bind(this);
  }

  componentDidMount() {
    this.setState({
      accordionData: data.map((item, index) => ({
        ...item,
        id: index,
        open: false,
      })),
    });
  }

  openItem(data) {
    this.setState({
      accordionData: data,
    });
  }

  render() {
    return (
      <Accordion
        data={this.state.accordionData}
        updateStateData={this.openItem}
      />
    );
  }
}
export default App;
