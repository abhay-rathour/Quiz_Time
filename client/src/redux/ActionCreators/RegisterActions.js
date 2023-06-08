import * as ActionTypes from '../ActionTypes';
import {baseUrl} from '../../shared/baseUrl';

export const requestAdminReg = (user) => {
    return {
        type: ActionTypes.ADMIN_REGISTRATION_REQUEST,
        user
    }
}
  
export const receiveAdminReg = (response) => {
    return {
        type: ActionTypes.ADMIN_REGISTRATION_SUCCESS,
        payload: response
    }
}
  
export const AdminRegError = (message) => {
    return {
        type: ActionTypes.ADMIN_REGISTRATION_FAILURE,
        message
    }
}

export const  adminRegistration= (user) => (dispatch) => {

    
    console.log('New Admin ', user);

    // const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'register/admins', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response => {alert('Your Registration is Sucessfull, Sign in to the New Account Using Username and Password! ')
    dispatch(receiveUserReg(response))})
    .catch(error => { console.log('Admin Registration ', error.message);
        alert('Your Registration was UnsucessFull\nError: '+ error.message); })
}


export const requestUserReg = (user) => {
    return {
        type: ActionTypes.USER_REGISTRATION_REQUEST,
        user
    }
}
  
export const receiveUserReg = (response) => {
    return {
        type: ActionTypes.USER_REGISTRATION_SUCCESS,
        payload: response
    }
}
  
export const UserRegError = (message) => {
    return {
        type: ActionTypes.USER_REGISTRATION_FAILURE,
        message
    }
}

export const  userRegistration= (user) => (dispatch) => {

    
    console.log('New User ', user);

    // const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'register/users', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response =>{alert('Your Registration is Sucessfull, Sign in to the New Account Using Username and Password! ')
         dispatch(receiveUserReg(response))})
    .catch(error => { console.log('User Registration ', error.message);
        alert('Your Registration was UnsucessFull\nError: '+ error.message); })
}
