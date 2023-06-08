import * as ActionTypes from '../ActionTypes';
import {baseUrl} from '../../shared/baseUrl';

export const groupsLoading = () => ({
    type: ActionTypes.GROUPS_LOADING
});

export const groupsFailed = (errmess) => ({
    type: ActionTypes.GROUPS_FAILED,
    payload: errmess
});

export const addGroups = (groups) => ({
    type: ActionTypes.ADD_GROUPS,
    payload: groups
});

export const createGroup = (group) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'groups', {
        method: "POST",
        body: JSON.stringify(group),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(groups => { console.log('Group Created', groups); dispatch(addGroups(groups)); })
    .catch(error => dispatch(groupsFailed(error.message)));
}
export const DeleteGroup = (groupId) => (dispatch) => {

  const bearer = 'Bearer ' + localStorage.getItem('token');

  return fetch(baseUrl + 'groups/'+groupId, {
      method: "DELETE",
      // body: JSON.stringify(group),
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      },
      credentials: "same-origin"
  })
  .then(response => {
      if (response) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(groups => { console.log('Group Deleted', groups); dispatch(addGroups(groups)); })
  .catch(error => dispatch(groupsFailed(error.message)));
}

// export const deleteFavorite = (dishId) => (dispatch) => {

//     const bearer = 'Bearer ' + localStorage.getItem('token');

//     return fetch(baseUrl + 'favorites/' + dishId, {
//         method: "DELETE",
//         headers: {
//           'Authorization': bearer
//         },
//         credentials: "same-origin"
//     })
//     .then(response => {
//         if (response.ok) {
//           return response;
//         } else {
//           var error = new Error('Error ' + response.status + ': ' + response.statusText);
//           error.response = response;
//           throw error;
//         }
//       },
//       error => {
//             throw error;
//       })
//     .then(response => response.json())
//     .then(favorites => { console.log('Favorite Deleted', favorites); dispatch(addFavorites(favorites)); })
//     .catch(error => dispatch(favoritesFailed(error.message)));
// };

export const fetchGroups = (usertype) => (dispatch) => {
    dispatch(groupsLoading(true));

    const bearer = 'Bearer ' + localStorage.getItem('token');
    var fetchgroup;
    if(usertype==='admins')
    {
      fetchgroup='groups/admingroups';
    }
    else{
      fetchgroup='groups/usergroups';
    }
    console.log(usertype + " "+fetchgroup)
    return fetch(baseUrl + fetchgroup, {
        headers: {
            'Authorization': bearer
        },
    })
    .then(response => {
        if (response) {
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
    .then(groups => dispatch(addGroups(groups)))
    .catch(error => dispatch(groupsFailed(error.message)));
}



export const acceptMember = (groupId,request) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl+'groups/' +groupId+'/member', {
        method: "PUT",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(groups => { console.log('Group Updated', groups); dispatch(addGroups(groups)); })
    .catch(error => dispatch(groupsFailed(error.message)));
}

export const removeReq= (groupId,reqId) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    var request={
        groupId:groupId,
        requestId:reqId
    }
    return fetch(baseUrl +'groups/'+groupId+'/removereq', {
        method: "DELETE",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(groups => { console.log('Group Updated', groups); dispatch(addGroups(groups)); })
    .catch(error => dispatch(groupsFailed(error.message)));
}
export const removeMem= (groupId,member) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    var request={
        groupId:groupId,
        memberId:member._id,
        name:member.name,
        uniqueID:member.uniqueID,
        userID:member.userID
    }
    return fetch(baseUrl +'groups/'+groupId+'/member', {
        method: "DELETE",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(group => { console.log('Group Updated', group); return group; })
    .catch(error => dispatch(groupsFailed(error.message)));
}

export const joinGroup = (groupId,request) => (dispatch) => {

  const bearer = 'Bearer ' + localStorage.getItem('token');
  
  return fetch(baseUrl+'groups/' +groupId+'/member', {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      },
      credentials: "same-origin"
  })
  .then(response => {
      if (response) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(groups => { 
    console.log('Group Updated', groups); 
    if(groups.warningMssg)
    {
      alert("Cannot make duplicate request. You are already a member...")
      // Redirect('/student')
    }
    else
      dispatch(addGroups(groups)); 
  })
  .catch(error => dispatch(groupsFailed(error.message)));
}


export const createTest = (groupId,test) => (dispatch) => {

  const bearer = 'Bearer ' + localStorage.getItem('token');
  
  return fetch(baseUrl+'groups/' +groupId+'/test', {
      method: "POST",
      body: JSON.stringify(test),
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      },
      credentials: "same-origin"
  })
  .then(response => {
      if (response) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(groups => { console.log('Test Updated in Group', groups); dispatch(addGroups(groups)); })
  .catch(error => dispatch(groupsFailed(error.message)));
}
