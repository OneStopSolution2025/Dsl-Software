import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stepperReducer from './slices/stepperSlice';
import filesReducer from './slices/filesSlice';
import markersReducer from './slices/markersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stepper: stepperReducer,
    files: filesReducer,
    markers: markersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore File objects in the files slice
        ignoredActions: ['files/addFiles'],
        ignoredPaths: ['files.uploadedFiles'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
