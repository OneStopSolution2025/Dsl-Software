import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Generate a more complex session ID like the example provided
const generateComplexSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const finalPart = Math.random().toString(36).substring(2, 15);

  return `${timestamp}-${randomPart}-${finalPart}`.replace(/(.{8})/g, '$1-').slice(0, -1);
};

interface SessionState {
  sessionId: string | null;
  isInitialized: boolean;
}

const initialState: SessionState = {
  sessionId: null,
  isInitialized: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    initializeSession: (state) => {
      if (!state.sessionId) {
        state.sessionId = generateComplexSessionId();
        state.isInitialized = true;

        // Store in sessionStorage for persistence across page reloads
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userSessionId', state.sessionId);
        }
      }
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
      state.isInitialized = true;

      // Update sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userSessionId', action.payload);
      }
    },
    clearSession: (state) => {
      state.sessionId = null;
      state.isInitialized = false;

      // Remove from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userSessionId');
        sessionStorage.removeItem('mapScreenshot');
      }
    },
    resetSession: () => {
      // This will be handled by the root reducer
      return initialState;
    },
    restoreSessionFromStorage: (state) => {
      if (typeof window !== 'undefined' && !state.sessionId) {
        const storedSessionId = sessionStorage.getItem('userSessionId');
        if (storedSessionId) {
          state.sessionId = storedSessionId;
          state.isInitialized = true;
        }
      }
    },
  },
});

export const {
  initializeSession,
  setSessionId,
  clearSession,
  restoreSessionFromStorage,
} = sessionSlice.actions;

export default sessionSlice.reducer;
