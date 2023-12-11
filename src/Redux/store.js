import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import fileReducer from './fileSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, fileReducer);

const store = configureStore({
  reducer: {
    file: persistedReducer,
  },
});

export const persistor = persistStore(store);
export default store;
