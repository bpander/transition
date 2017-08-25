import React from 'react';

export default class Transition extends React.Component {

  static defaultProps = {
    children: () => {},
    styles: [],
  };

  constructor(props) {
    super(props);
    this.afId = -1;
    this.state = {
      styles: props.styles,
    };
  }

  render() {
    return this.props.children(this.props.styles);
  }
}
