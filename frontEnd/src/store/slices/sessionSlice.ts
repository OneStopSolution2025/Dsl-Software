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
      // Prevent double initialization
      if (state.isInitialized && state.sessionId) {
        // console.log('[Session] Already initialized, skipping:', state.sessionId);
        return;
      }

      // Always create a new session on page load/refresh
      state.sessionId = generateComplexSessionId();
      state.isInitialized = true;

      // Store in sessionStorage (will be cleared when tab closes)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userSessionId', state.sessionId);
        // console.log('[Session] Created new session:', state.sessionId);
      }
    },
    // This should NOT be used for API responses anymore
    setSessionId: (state, action: PayloadAction<string>) => {
      console.warn('[Session] setSessionId called - session should not be changed after initialization');
      // Only allow if no session exists yet
      if (!state.sessionId) {
        state.sessionId = action.payload;
        state.isInitialized = true;

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userSessionId', action.payload);
        }
      }
    },
    clearSession: (state) => {
      state.sessionId = null;
      state.isInitialized = false;

      // Remove from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userSessionId');
        sessionStorage.removeItem('mapScreenshot');
        // console.log('[Session] Cleared session');
      }
    },
    resetSession: () => {
      // This will be handled by the root reducer
      return initialState;
    },
  },
});

export const {
  initializeSession,
  setSessionId,
  clearSession,
  resetSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
