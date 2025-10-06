# Implementation Guide - Step by Step

## 🚀 Quick Start

### Step 1: Initialize Project

```bash
# Create Vite project with React + TypeScript
npm create vite@latest . -- --template react-ts

# Answer prompts:
# ✔ Current directory is not empty. Remove existing files and continue? … yes
# (This will keep .git folder)
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install react-router-dom @reduxjs/toolkit react-redux

# Form handling & validation
npm install react-hook-form zod @hookform/resolvers

# HTTP client & utilities
npm install axios react-hot-toast

# UI & Animation
npm install framer-motion lucide-react clsx

# File upload
npm install react-dropzone

# Google Maps
npm install @react-google-maps/api

# Lottie animations
npm install lottie-react

# Screenshot/download
npm install html2canvas

# Headless UI components
npm install @headlessui/react

# Date utilities
npm install date-fns

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# TypeScript types
npm install -D @types/node
```

### Step 3: Configure Tailwind CSS

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          amber: '#f59e0b',
          red: '#ef4444',
          green: '#10b981',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

**src/index.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-neutral-50 text-neutral-900 font-sans antialiased;
  }
}

@layer components {
  /* Glass effects */
  .glass-card {
    @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
  }
  
  .glass-card-strong {
    @apply bg-white/25 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl;
  }
  
  .glass-input {
    @apply bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-neutral-900 placeholder:text-neutral-600/50;
  }
  
  .glass-input:focus {
    @apply bg-white/30 border-primary-500 outline-none ring-4 ring-primary-500/10;
  }
  
  /* Buttons */
  .btn-primary {
    @apply bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200;
  }
  
  .btn-secondary {
    @apply bg-white/15 backdrop-blur-md text-neutral-900 px-6 py-3 rounded-lg font-semibold border border-white/30 hover:bg-white/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200;
  }
  
  /* Gradients */
  .bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .bg-gradient-blue {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
  }
  
  .bg-gradient-subtle {
    background: linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%);
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Step 4: Setup Environment Variables

**.env**
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_APP_NAME=Insurance Claims
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_FILES=50
```

**.env.example**
```bash
VITE_API_BASE_URL=
VITE_GOOGLE_MAPS_API_KEY=
VITE_APP_NAME=Insurance Claims
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_FILES=50
```

---

## 📁 Create Folder Structure

```bash
# Create all directories
mkdir -p src/{assets/{icons,lottie,images},components/{common,layout,auth,steps},pages,store/{slices,api},hooks,utils,types,routes}

# Create placeholder files
touch src/components/common/{Button,Input,GlassCard,Loading,Toast}.tsx
touch src/components/layout/{Header,AuthLayout,MainLayout}.tsx
touch src/components/auth/{RegisterForm,LoginForm}.tsx
touch src/components/steps/{StepIndicator,UploadDocuments,OCRExtraction,AutoFill,Preview,RoadMap,Download}.tsx
touch src/pages/{Register,Login,Home}.tsx
touch src/store/slices/{authSlice,stepperSlice,markersSlice,filesSlice}.ts
touch src/store/{index,api/apiSlice}.ts
touch src/hooks/{useAuth,useFileUpload,useMap}.ts
touch src/utils/{validation,fileHelpers,mapHelpers,constants}.ts
touch src/types/{auth.types,file.types,map.types}.ts
touch src/routes/{ProtectedRoute,index}.tsx
```

---

## 🔧 Core Configuration Files

### 1. Redux Store Setup

**src/store/index.ts**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stepperReducer from './slices/stepperSlice';
import markersReducer from './slices/markersSlice';
import filesReducer from './slices/filesSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stepper: stepperReducer,
    markers: markersReducer,
    files: filesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 2. Type Definitions

**src/types/auth.types.ts**
```typescript
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

**src/types/file.types.ts**
```typescript
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export interface FileState {
  uploadedFiles: UploadedFile[];
  serverFileIds: string[];
  docxUrl: string | null;
  finalDocxUrl: string | null;
}
```

**src/types/map.types.ts**
```typescript
export type MarkerType = 'car' | 'bike' | 'blast' | 'trespasser';

export interface MapMarker {
  id: string;
  type: MarkerType;
  lat: number;
  lng: number;
}

export interface MarkersState {
  items: MapMarker[];
}
```

### 3. Constants

**src/utils/constants.ts**
```typescript
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Insurance Claims';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const MAX_FILE_SIZE = Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760; // 10MB
export const MAX_FILES = Number(import.meta.env.VITE_MAX_FILES) || 50;

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const FILE_TYPE_EXTENSIONS = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

export const STEPS = [
  { id: 1, name: 'Upload Documents', key: 'upload' },
  { id: 2, name: 'OCR Extraction', key: 'ocr' },
  { id: 3, name: 'AutoFill', key: 'autofill' },
  { id: 4, name: 'Preview', key: 'preview' },
  { id: 5, name: 'Road Map', key: 'roadmap' },
  { id: 6, name: 'Download', key: 'download' },
];

export const MARKER_TYPES: MarkerType[] = ['car', 'bike', 'blast', 'trespasser'];

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/register',
    LOGIN: '/token',
  },
  FILES: {
    UPLOAD: '/upload-files',
  },
  PROCESS: {
    AUTOFILL: '/document/process',
  },
  DOWNLOAD: {
    LIST: '/list',
  },
};
```

### 4. Validation Schemas

**src/utils/validation.ts**
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
```

### 5. Axios Configuration

**src/utils/axios.config.ts**
```typescript
import axios from 'axios';
import { API_BASE_URL } from './constants';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🎯 Implementation Order

### Phase 1: Foundation (Day 1)
1. ✅ Setup project structure
2. ✅ Configure Tailwind CSS
3. ✅ Create type definitions
4. ✅ Setup Redux store
5. ✅ Create common components (Button, Input, GlassCard)
6. ✅ Create layout components (Header, AuthLayout, MainLayout)

### Phase 2: Authentication (Day 2)
1. ✅ Create auth slice
2. ✅ Build Register page
3. ✅ Build Login page
4. ✅ Setup protected routes
5. ✅ Implement token management

### Phase 3: Home & Stepper (Day 3)
1. ✅ Create stepper slice
2. ✅ Build StepIndicator component
3. ✅ Setup step navigation
4. ✅ Create Home page layout

### Phase 4: Steps 1-2 (Day 4)
1. ✅ Build UploadDocuments component
2. ✅ Implement file validation
3. ✅ Build OCRExtraction component
4. ✅ Implement batch upload logic

### Phase 5: Steps 3-4 (Day 5)
1. ✅ Build AutoFill component
2. ✅ Integrate Lottie animation
3. ✅ Build Preview component
4. ✅ Integrate DOCX viewer

### Phase 6: Step 5 (Day 6-7)
1. ✅ Build RoadMap component
2. ✅ Integrate Google Maps
3. ✅ Implement draggable markers
4. ✅ Add screenshot functionality

### Phase 7: Step 6 & Polish (Day 7-8)
1. ✅ Build Download component
2. ✅ Add toast notifications
3. ✅ Implement error handling
4. ✅ Test all flows
5. ✅ Optimize performance

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Register with valid data
- [ ] Register with invalid data (validation errors)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token persistence (refresh page)
- [ ] Logout functionality
- [ ] Protected route access without token

### File Upload Flow
- [ ] Upload single file
- [ ] Upload multiple files
- [ ] Upload file exceeding size limit
- [ ] Upload unsupported file type
- [ ] Remove uploaded file
- [ ] Batch upload (5 files at a time)
- [ ] Handle upload errors

### Step Navigation
- [ ] Navigate forward through steps
- [ ] Navigate backward through steps
- [ ] Step validation before proceeding
- [ ] Auto-navigation (Step 3)
- [ ] Stepper indicator updates

### Map Functionality
- [ ] Load Google Maps
- [ ] Get user location
- [ ] Switch map views
- [ ] Drag and drop markers
- [ ] Update marker positions
- [ ] Clear all markers
- [ ] Download map screenshot

### General
- [ ] Toast notifications display correctly
- [ ] Loading states show properly
- [ ] Error messages are clear
- [ ] Responsive design works
- [ ] Animations are smooth

---

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Tailwind styles not applying
**Solution**: Ensure `index.css` is imported in `main.tsx`

### Issue 2: Google Maps not loading
**Solution**: Check API key in `.env` and enable Maps JavaScript API in Google Cloud Console

### Issue 3: File upload fails
**Solution**: Check CORS settings on backend and file size limits

### Issue 4: Token not persisting
**Solution**: Verify localStorage is accessible and not blocked by browser

### Issue 5: Redux state not updating
**Solution**: Ensure reducers are properly registered in store configuration

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [React Hook Form Docs](https://react-hook-form.com)
- [Google Maps React Docs](https://react-google-maps-api-docs.netlify.app)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

*Ready to start building! Follow the implementation order and refer back to this guide as needed.*
