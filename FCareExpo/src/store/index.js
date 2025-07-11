import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import childReducer from './childSlice';
import reminderReducer from './reminderSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    child: childReducer,
    reminder: reminderReducer,
  },
});

export default store; 