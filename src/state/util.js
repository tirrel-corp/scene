export const useMockData = parseInt(process.env.REACT_APP_MOCK_DATA, 10);

export const createStorageKey = name => `narthex/~${process.env.REACT_APP_SHIP}/${name}`;

export const storageVersion = parseInt(process.env.REACT_APP_STORAGE_VERSION, 10);
