import React, { Component } from 'react';
import Transition from 'lib/Transition';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: [ 'foo', 'bar' ],
    };
  }

  static itemToStyle(item) {
    return { data: item };
  }

  render() {
    return (
      <Transition
        styles={this.state.items.map(App.itemToStyle)}
      >{interpolatedStyles => (
        <ul>
          {interpolatedStyles.map(({ data }) => (
            <li>{data}</li>
          ))}
        </ul>
      )}</Transition>
    );
  }

}
