import * as ActionTypes from '../ActionTypes';
import {baseUrl} from '../../shared/baseUrl';
export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
}
  
export const receiveLogin = (response,access) => {
    console.log(response,access);
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        payload: response,
        access
    }
}
  
export const loginError = (err) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        err
    }
}

// export const loginUser = (creds) => (dispatch) => {
//     // We dispatch requestLogin to kickoff the call to the API
//     const access=creds.userType==='admins'?true:false;
//     dispatch(requestLogin(creds))
//     const type= access?'/admin':'/user';
//     return fetch(baseUrl + 'login'+type, {
//         method: 'POST',
//         headers: { 
//             'Content-Type':'application/json' 
//         },
//         body: JSON.stringify(creds)
//     })
//     .then(response => {
//         if (response) {
//              console.log( response);
//             return response;
//         } else {
//             var error = new Error('Error ' + response.status + ': ' + response.statusText);
//             error.response = response;
//             throw error;
//         }
//         },
//         error => {
//             throw error;
//         })
//     .then(response => response.json())
//     .then(response => {
//         if (response) {
//             console.log("I am Here");
//             console.log(response);
//             console.log(access);
//             // If login was successful, set the token in local storage
//             localStorage.setItem('token', response.token);
//             localStorage.setItem('user', JSON.stringify(response.user));
//             localStorage.setItem('userId',response.user._id);
//             localStorage.setItem('isAdmin',access);
            
//             dispatch(receiveLogin(response,access));
//         }
//         else {
//             var error = new Error('Error ' + response.status);
//             error.response = response;
//             throw error;
//         }
//     })
//     .catch(error => dispatch(loginError(error.message)))
// };

export const loginUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    const access=creds.userType==='admins'?true:false;
    dispatch(requestLogin(creds))
    const type= access?'/admin':'/user';
    return fetch(baseUrl + 'login'+type, {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
            if (response) {
                //  console.log( response);
                return response;
            } 
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },error => { throw error})
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            // If login was successful, set the token in local storage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('userId',response.user._id);
            localStorage.setItem('isAdmin',access);
            dispatch(receiveLogin(response,access));
        }
        else {
           
            var error = response.error
            throw error;
        }
    })
    .catch(error => dispatch(loginError(error)))
};



export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout())
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    // dispatch(favoritesFailed("Error 401: Unauthorized"));
    dispatch(receiveLogout())
}
