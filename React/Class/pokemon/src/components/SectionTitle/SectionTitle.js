import React, { Component } from 'react';
import './SectionTitle.css';

class SectionTitle extends Component {
  render() {
    return <div className='sectionTitle'>{this.props.title}</div>;
  }
}
export default SectionTitle;
