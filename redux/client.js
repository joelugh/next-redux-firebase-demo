const SET_INITIALISED = 'CLIENT/SET_INITIALISED';

export const clientInitialState = {
  initialised: false,
};

export const setInitialised = bool => {
  return {
    type: SET_INITIALISED,
    payload: bool,
  }
};

export default (state = clientInitialState, {type, payload}) => {
  switch (type) {
    case SET_INITIALISED:
      return {...state, initialised: payload};
    default:
      return state;
  }
};
