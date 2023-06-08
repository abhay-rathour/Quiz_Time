 import * as ActionTypes from './ActionTypes';



// export const Auth = (state={
//     isAuthenticated: false,
//     isAdmin: true,
// },action)=>{
//     switch(action.type){
//         default:
//         return state
//     }

// }
export const Auth = (state = {
    isLoading: false,
    isAuthenticated: localStorage.getItem('user')?true:false,
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    err: {
        password:false,
        username:false,
        passMessage:'',
        userMessage:''
    },
    isAdmin:localStorage.getItem('isAdmin')==='true'?true:false,
}, action) => {
switch (action.type) {
    case ActionTypes.LOGIN_REQUEST:
        return {...state,
            isLoading: true,
            isAuthenticated: false, 
        };
    case ActionTypes.LOGIN_SUCCESS:
        return {...state,
            isLoading: false,
            isAuthenticated: true,
            err: '',
            user:action.payload.user,
            isAdmin:action.access
        };
    case ActionTypes.LOGIN_FAILURE:
        return {...state,
            isLoading: false,
            isAuthenticated: false,
            err: action.err
        };
    case ActionTypes.LOGOUT_REQUEST:
        return {...state,
            isLoading: true,
            isAuthenticated: true
        };
    case ActionTypes.LOGOUT_SUCCESS:
        return {...state,
            isLoading: false,
            isAuthenticated: false,
            token: '',
            user: null
        };
    default:
        return state
}
}