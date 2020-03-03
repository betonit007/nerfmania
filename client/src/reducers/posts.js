import { GET_POSTS, POST_ERROR } from '../actions/types'

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
}

export default (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_POSTS:
      return {
        ...state, 
        posts: payload,
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: true
      }
    default: 
    return state
  }
}