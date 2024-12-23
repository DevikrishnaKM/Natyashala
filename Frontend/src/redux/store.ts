import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import authSlice from './slices/authSlice';
import adminSlice from './slices/adminSlice';
import userSlice from './slices/userSlice';

// Configure redux-persist settings
const persistConfig = {
  key: 'root',
  storage, // Use localStorage for persistence
};

// Combine reducers (add more slices as needed)
const rootReducer = combineReducers({
  auth: authSlice,  // Assuming authSlice is your authentication-related state
  admin: adminSlice,
  user:userSlice,
});

// Wrap the rootReducer with persistReducer to make it persistent
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer, // Use the persistedReducer
  
});

// Export types for better type safety
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persist store configuration (handles persistence)
export const persistor = persistStore(store);

// Export the store as default
export default store;
