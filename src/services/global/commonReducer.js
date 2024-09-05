import { SERVICE_FAIL, SERVICE_INPROGRESS, SERVICE_SUCCESS, TIMEOUT_ERROR } from "./constants";

const INITIAL_STATE = {
    serviceError: '',
    serviceLoading: false,
    serviceType: '',
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SERVICE_INPROGRESS:
            return {
                serviceType: SERVICE_INPROGRESS,
            };
        case SERVICE_FAIL:
            return {
                serviceType: SERVICE_FAIL,
            };
        case TIMEOUT_ERROR:
            return {
                serviceType: TIMEOUT_ERROR,
                payload: action.payload
            };
        case SERVICE_SUCCESS:
            return {
                serviceType: SERVICE_SUCCESS,
            };
        default:
            return state;
    }
};
