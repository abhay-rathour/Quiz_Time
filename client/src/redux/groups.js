import * as ActionTypes from './ActionTypes';

export const Groups = (state = {
        isLoading: true,
        errMess: null,
        groups: null
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_GROUPS:
            return {...state, isLoading: false, errMess: null, groups: action.payload};

        case ActionTypes.GROUPS_LOADING:
            return {...state, isLoading: true, errMess: null, groups: null};

        case ActionTypes.GROUPS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, groups: null};

        default:
            return state;
    }
}