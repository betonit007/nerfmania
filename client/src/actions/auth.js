import axios from 'axios'
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOG_OUT } from '../actions/types'

//LOAD USER
export const loadUser = () => async dispatch => {
    if(localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios.get('/api/auth');
        console.log(res)
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
} 

//Register User
export const register = (userInfo) => async dispatch => {

    try {
        
      const res = await axios.post('/api/users', userInfo) 
      console.log(res.data)
      dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data
      })

      dispatch(loadUser())

    } catch (err) {
        
        const errors = err.response.data.errors;

        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

//Login User

export const login = (email, password) => async dispatch => {
  
    try {
        
        const res = await axios.post('/api/auth', {email, password})

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        

    } catch (err) {
        
        const errors = err.response.data.errors;

        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

//////////////Log out

export const logout = () => dispatch => {
    dispatch({ type: LOG_OUT })
}