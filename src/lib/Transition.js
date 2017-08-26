import { map, some } from 'lib/objects';
import * as steppers from 'lib/steppers';
import React from 'react';

const LINEAR = 'LINEAR';
const defaults = { type: LINEAR, value: 0, v: 100, target: 0, delay: 0 };
export const linear = (target = 0, overrides = {}) => ({
  ...defaults,
  target,
  value: target,
  ...overrides,
});


const step = (interpolation, config, deltaT) => {
  const newInterpolation = {
    ...interpolation,
    style: map(interpolation.style, (style, key) => {
      const configStyle = config.style[key];
      switch (configStyle.type) {
        case LINEAR:  return steppers.linear(style, config.style[key], deltaT);
        default:      return configStyle;
      }
    }),
  };
  return newInterpolation;
};

const merge = (interpolations, configs, deltaT) => {
  return interpolations.map(interpolation => {
    const transition = configs.find(t => t.key === interpolation.key);
    return step(interpolation, transition, deltaT);
  });
};

const shouldAnimate = interpolations => {
  return some(interpolations, interpolation => {
    return some(interpolation.style, style => style.value !== style.target);
  });
};

export default class Transition extends React.Component {

  static defaultProps = {
    children: () => {},
    interpolations: [],
  };

  constructor(props) {
    super(props);

    this.afId = -1;

    this.lastKnownTime = performance.now();

    this.state = {
      interpolations: props.configs,
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
    const interpolations = merge(this.state.interpolations, this.props.configs, deltaT);
    this.setState({ interpolations });
    this.lastKnownTime = now;
    if (shouldAnimate(interpolations)) {
      this.afId = requestAnimationFrame(this.onAnimationFrame);
    }
  };

  render() {
    return this.props.children(this.state.interpolations);
  }
}
