import React from 'react';

const LINEAR = 'LINEAR';
const defaults = { type: LINEAR, value: 0, v: 100, target: 0, delay: 0 };
export const linear = (target = 0, overrides = {}) => ({
  ...defaults,
  target,
  value: target,
  ...overrides,
});

const step = (styleA, styleB, deltaT) => {
  const direction = (styleB.target > styleA.value) ? 1 : -1;
  let newValue = styleA.value + styleB.v * (deltaT / 1000) * direction;
  const isComplete = (styleA.value < styleB.target && newValue >= styleB.target)
    || (styleA.value > styleB.target && newValue <= styleB.target);
  if (isComplete) {
    newValue = styleB.target;
  }
  return { ...styleB, value: newValue };
};

const merge = (interpolations, transitions, deltaT) => {
  return interpolations.map(interpolation => {
    const transition = transitions.find(t => t.key === interpolation.key);
    for (const key in interpolation.style) {
      interpolation.style[key] = step(interpolation.style[key], transition.style[key], deltaT);
    }
    return interpolation;
  });
};

const shouldAnimate = styles => Object.keys(styles).some(key => {
  const style = styles[key];
  return Object.keys(style.style).some(styleKey => {
    const thing = style.style[styleKey];
    return thing.value !== thing.target;
  });
});

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
