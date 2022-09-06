import { combineReducers } from 'redux';

const INITIAL_STATE = {
    deeplink: ""
}

const DeeplinkReducer = (state = INITIAL_STATE, action) => {
    console.log("payload: "+action.payload);
    switch (action.type) {
        case 'UPDATE_DEEPLINK':
            return {
                ...state,
                deeplink: action.payload
            };
        default:
            return state;
    }
}

export default combineReducers({
    deeplinkReducer: DeeplinkReducer
});