import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stepperReducer from './slices/stepperSlice';
import filesReducer from './slices/filesSlice';
import mapReducer from './slices/mapSlice';
import sessionReducer from './slices/sessionSlice';
import formReducer from './slices/formSlice';
import markersReducer from './slices/markersSlice';
import canvasReducer from './slices/canvasSlice';


// Create the root reducer
const combinedReducer = combineReducers({
  auth: authReducer,
  stepper: stepperReducer,
  files: filesReducer,
  map: mapReducer,
  session: sessionReducer,
  form: formReducer,
  markers: markersReducer,
  canvas: canvasReducer,
});


// ✅ Load persisted Auth from localStorage
const loadAuthState = () => {
  try {
    const serializedAuth = localStorage.getItem('authState');
    if (!serializedAuth) return undefined;
    return { auth: JSON.parse(serializedAuth) };
  } catch {
    return undefined;
  }
};

// ✅ Save Auth state only
const saveAuthState = (state: any) => {
  try {
    const serializedAuth = JSON.stringify(state.auth);
    localStorage.setItem('authState', serializedAuth);
  } catch {
    // ignore write errors
  }
};

// Root reducer with reset logic
export const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STATE') {
    // Keep only auth state while resetting others
    const authState = state?.auth;
    state = { auth: authState };
  }
  return combinedReducer(state, action);
};



export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadAuthState(), // 👈 persist Auth only
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore File objects in the files slice
        ignoredActions: ['files/addFiles'],
        ignoredPaths: ['files.uploadedFiles'],
      },
    }),
});

// Subscribe to store updates and persist Auth only
store.subscribe(() => {
  saveAuthState(store.getState());
});

// Action to reset the entire state
export const resetState = () => ({ type: 'RESET_STATE' });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
