import _ from 'lodash';

export const useMockData = parseInt(process.env.REACT_APP_MOCK_DATA, 10);

export const createStorageKey = name => `narthex/~${process.env.REACT_APP_SHIP}/${name}`;

export const storageVersion = parseInt(process.env.REACT_APP_STORAGE_VERSION, 10);

export const normalizeUrbitColor = color => {
  if (color.startsWith('#')) {
    return color;
  }

  const colorString = color.slice(2).replace('.', '').toUpperCase();
  const lengthAdjustedColor = _.padEnd(colorString, 6, _.last(colorString));
  return `#${lengthAdjustedColor}`;
}
