import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from "./Slices/user"

export default configureStore({
  reducer: {
    userReducer: userReducer,
  },
});
export const rootReducer = combineReducers({  
  userReducer: userReducer
});

export type RootState = ReturnType<typeof rootReducer>