import React from 'react';

const defaults = { x: 0, v: 10 };
export const linear = (destX = 0, overrides = {}) => ({ ...defaults, destX, ...overrides });

const interpolateTransition = ({ key, data, style }) => {
  const interpolatedStyle = {};
  const interpolatedTransition = { key, data, style: interpolatedStyle };
  for (const interpolatedProp in style) {
    interpolatedStyle[interpolatedProp] = style[interpolatedProp].destX;
  }
  return interpolatedTransition;
};

export default class Transition extends React.Component {

  static defaultProps = {
    children: () => {},
    styles: [],
  };

  constructor(props) {
    super(props);

    this.afId = -1;

    this.state = {
      styles: props.styles.map(interpolateTransition),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ styles: nextProps.styles.map(interpolateTransition) });
  }

  render() {
    return this.props.children(this.state.styles);
  }
}
