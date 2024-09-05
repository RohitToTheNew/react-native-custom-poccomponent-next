import {NET_STATE} from './constants';

export const getIsInternetConnected = isConnected => dispatch => {
  dispatch({
    type: NET_STATE,
    isConnected,
  });
};
