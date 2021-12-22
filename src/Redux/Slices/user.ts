import { createSlice } from '@reduxjs/toolkit';
export const userSlice = createSlice({
    name: 'user',
    initialState: {
      email: null,
      user: { email: null, name: null, givenName: null, imageUrl: null }
    },
    reducers: {
      logUser: (state, action) => 
      {
          state.user = action.payload;
      },  
      login: (state, action) => {    
        state.email = action.payload;
      }, 
      logout: (state) => {     
        state.user = { 
            email: null, 
            name: null,
            givenName: null, 
            imageUrl: null 
        };   
        state.email = null;
      }
    },
  })
  export const { login, logout, logUser } = userSlice.actions
  export default userSlice.reducer