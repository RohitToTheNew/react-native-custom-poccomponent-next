import { combineReducers } from 'redux';
import ManageAppReducer from '../services/apiCall/reducer';

export default combineReducers({
    manageAppReducer: ManageAppReducer,
});
