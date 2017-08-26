import React, { Component } from 'react';
import Transition, { linear } from 'lib/Transition';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isToggled: false,
      numbers: [ Math.random(), Math.random() ],
    };
  }

  onMoveClick = () => {
    this.setState({ isToggled: !this.state.isToggled });
  };

  onAddClick = () => {
    const numbers = [ ...this.state.numbers ];
    const randomIndex = Math.round(Math.random() * numbers.length);
    numbers.splice(randomIndex, 0, Math.random());
    this.setState({ numbers });
  };

  numberToStyle(number, i) {
    const offset = (this.state.isToggled) ? 100 : 0;
    return { key: number, data: number, style: { x: linear(i * 60 + offset) } };
  }

  render() {
    return (
      <div>
        <button onClick={this.onMoveClick}>Move</button>
        <button onClick={this.onAddClick}>Add</button>
        <Transition
          configs={this.state.numbers.map((n, i) => this.numberToStyle(n, i))}
        >{interpolations => (
          <ul className="absoluteChildren">
            {interpolations.map(({ key, data, style }) => (
              <li key={key}>
                <div
                  className="square"
                  style={{ transform: `translateX(${style.x.value}px)` }}
                />
              </li>
            ))}
          </ul>
        )}</Transition>
      </div>
    );
  }

}
