import React from 'react';

const LINEAR = 'LINEAR';
const defaults = { type: LINEAR, value: 0, v: 10, target: 0, delay: 0 };
export const linear = (target = 0, overrides = {}) => ({
  ...defaults,
  target,
  value: target,
  ...overrides,
});

const merge = (interpolations, transitions, deltaT = 0) => {
  return interpolations.map(interpolation => {
    const transition = transitions.find(t => t.key === interpolation.key);
    for (const key in interpolation.style) {
      interpolation.style[key].value += transition.style[key].v;
    }
    return interpolation;
  });
};

const shouldAnimate = () => true;

export default class Transition extends React.Component {

  static defaultProps = {
    children: () => {},
    styles: [],
  };

  constructor(props) {
    super(props);

    this.afId = -1;

    this.lastKnownTime = performance.now();

    this.state = {
      styles: props.styles,
    };
  }

  componentWillReceiveProps(nextProps) {
    cancelAnimationFrame(this.afId);
    this.lastKnownTime = performance.now();
    this.afId = requestAnimationFrame(this.onAnimationFrame);
  }

  onAnimationFrame = () => {
    const now = performance.now();
    const deltaT = now - this.lastKnownTime;
    const styles = merge(this.state.styles, this.props.styles, deltaT);
    this.setState({ styles });
    this.lastKnownTime = now;
    if (shouldAnimate(styles)) {
      this.afId = requestAnimationFrame(this.onAnimationFrame);
    }
  };

  render() {
    return this.props.children(this.state.styles);
  }
}
