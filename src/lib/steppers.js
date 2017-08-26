
export const linear = (style, styleConfig, deltaT) => {
  const { value } = style;
  const { target, v } = styleConfig;
  if (value === target) {
    return styleConfig;
  }
  const direction = (target > value) ? 1 : -1;
  let newValue = value + v * (deltaT / 1000) * direction;
  const isComplete = (value < target && newValue >= target)
    || (value > target && newValue <= target);
  if (isComplete) {
    newValue = target;
  }
  return { ...styleConfig, value: newValue };
};
