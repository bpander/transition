
const noop = () => {};

export const map = (obj, mapper = x => x) => {
  const mapped = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    mapped[key] = mapper(obj[key], key);
  }
  return mapped;
};

export const some = (obj, predicate = noop) => {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    if (predicate(obj[key], key) === true) {
      return true;
    }
  }
  return false;
};
