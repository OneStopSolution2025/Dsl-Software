# Technical Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│                     (React + TypeScript)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Register   │  │    Login     │  │     Home     │     │
│  │     Page     │  │     Page     │  │     Page     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                            ▼                                 │
│         ┌────────────────────────────────────┐              │
│         │      React Router (v6)             │              │
│         │  - Protected Routes                │              │
│         │  - Auth Guards                     │              │
│         └────────────┬───────────────────────┘              │
│                      │                                       │
│         ┌────────────▼───────────────────────┐              │
│         │     Redux Toolkit Store            │              │
│         ├────────────────────────────────────┤              │
│         │  - authSlice (user, token)         │              │
│         │  - stepperSlice (currentStep)      │              │
│         │  - markersSlice (map markers)      │              │
│         │  - filesSlice (uploaded files)     │              │
│         │  - RTK Query (API cache)           │              │
│         └────────────┬───────────────────────┘              │
│                      │                                       │
│         ┌────────────▼───────────────────────┐              │
│         │      API Layer (Axios)             │              │
│         │  - Request Interceptor (token)     │              │
│         │  - Response Interceptor (errors)   │              │
│         │  - Retry Logic                     │              │
│         └────────────┬───────────────────────┘              │
│                      │                                       │
└──────────────────────┼───────────────────────────────────────┘
                       │
                       │ HTTPS
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                      Backend API                              │
│                   (Your Backend Service)                      │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /api/auth/register                                      │
│  POST /api/auth/login                                         │
│  POST /api/upload              (max 5 files)                  │
│  POST /api/process/autofill                                   │
│  GET  /api/download/final                                     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
│
├── Router
│   │
│   ├── Public Routes
│   │   ├── /register → RegisterPage
│   │   │   └── AuthLayout
│   │   │       └── RegisterForm
│   │   │           ├── Input (username)
│   │   │           ├── Input (email)
│   │   │           ├── Input (password)
│   │   │           ├── Input (confirm password)
│   │   │           ├── Button (submit)
│   │   │           └── Link (to login)
│   │   │
│   │   └── /login → LoginPage
│   │       └── AuthLayout
│   │           └── LoginForm
│   │               ├── Input (username)
│   │               ├── Input (password)
│   │               ├── Button (submit)
│   │               └── Link (to register)
│   │
│   └── Protected Routes
│       └── / → HomePage
│           └── MainLayout
│               ├── Header
│               │   ├── Logo
│               │   └── UserMenu (if authenticated)
│               │       └── Dropdown
│               │           └── LogoutButton
│               │
│               └── StepperWorkflow
│                   ├── StepIndicator
│                   │   └── StepDot × 6
│                   │
│                   ├── StepContent (dynamic)
│                   │   │
│                   │   ├── Step 1: UploadDocuments
│                   │   │   ├── DropZone
│                   │   │   ├── FileList
│                   │   │   │   └── FileCard × N
│                   │   │   └── Button (upload)
│                   │   │
│                   │   ├── Step 2: OCRExtraction
│                   │   │   ├── FileList (with progress)
│                   │   │   │   └── FileCard × N
│                   │   │   │       └── LoadingSpinner
│                   │   │   └── Buttons (back, next)
│                   │   │
│                   │   ├── Step 3: AutoFill
│                   │   │   ├── LottieAnimation
│                   │   │   └── StatusText
│                   │   │
│                   │   ├── Step 4: Preview
│                   │   │   ├── DocxViewer
│                   │   │   ├── InfoMessage
│                   │   │   └── Button (confirm)
│                   │   │
│                   │   ├── Step 5: RoadMap
│                   │   │   ├── ViewToggle
│                   │   │   ├── GoogleMap
│                   │   │   │   └── DraggableMarker × N
│                   │   │   ├── MarkerPalette
│                   │   │   │   └── SVGIcon × N
│                   │   │   └── Buttons (clear, download, back, next)
│                   │   │
│                   │   └── Step 6: Download
│                   │       └── Button (download)
│                   │
│                   └── Navigation
│                       ├── Button (back)
│                       └── Button (next)
│
└── Global Components
    ├── Toast (react-hot-toast)
    ├── Modal (auth warning)
    └── ErrorBoundary
```

---

## State Management Architecture

### Redux Store Structure

```typescript
{
  auth: {
    user: {
      id: string;
      username: string;
      email: string;
    } | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  },
  
  stepper: {
    currentStep: 1 | 2 | 3 | 4 | 5 | 6;
    completedSteps: number[];
    canProceed: boolean;
  },
  
  files: {
    uploadedFiles: Array<{
      id: string;
      name: string;
      size: number;
      file: File;
      status: 'pending' | 'uploading' | 'success' | 'error';
      progress: number;
    }>;
    serverFileIds: string[];
    docxUrl: string | null;
  },
  
  markers: {
    items: Array<{
      id: string;
      type: 'car' | 'bike' | 'blast' | 'trespasser';
      lat: number;
      lng: number;
    }>;
  },
  
  api: {
    // RTK Query cache
  }
}
```

---

## Data Flow Diagrams

### Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Register Form   │
│ - Validate      │
│ - Submit        │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ POST /register  │
└────┬────────────┘
     │
     ├─ Success ──────────┐
     │                    ▼
     │            ┌───────────────┐
     │            │ Success Toast │
     │            └───────┬───────┘
     │                    │
     │                    ▼
     │            ┌───────────────┐
     │            │ Navigate to   │
     │            │  Login Page   │
     │            └───────┬───────┘
     │                    │
     │                    ▼
     │            ┌───────────────┐
     │            │  Login Form   │
     │            └───────┬───────┘
     │                    │
     │                    ▼
     │            ┌───────────────┐
     │            │ POST /login   │
     │            └───────┬───────┘
     │                    │
     │                    ├─ Success ────┐
     │                    │               ▼
     │                    │       ┌──────────────┐
     │                    │       │ Store Token  │
     │                    │       │ (localStorage)│
     │                    │       └──────┬───────┘
     │                    │              │
     │                    │              ▼
     │                    │       ┌──────────────┐
     │                    │       │ Update Redux │
     │                    │       │  Auth State  │
     │                    │       └──────┬───────┘
     │                    │              │
     │                    │              ▼
     │                    │       ┌──────────────┐
     │                    │       │ Navigate to  │
     │                    │       │  Home Page   │
     │                    │       └──────────────┘
     │                    │
     │                    └─ Error ──────┐
     │                                   ▼
     │                           ┌───────────────┐
     │                           │  Error Toast  │
     │                           └───────────────┘
     │
     └─ Error ──────────┐
                        ▼
                ┌───────────────┐
                │  Error Toast  │
                └───────────────┘
```

### File Upload Flow (Step 1 → Step 2)

```
┌──────────────┐
│   Step 1:    │
│   Upload     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ User drops files │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Validate files   │
│ - Type           │
│ - Size           │
└──────┬───────────┘
       │
       ├─ Valid ────────┐
       │                ▼
       │        ┌───────────────┐
       │        │ Add to Redux  │
       │        │  files.items  │
       │        └───────┬───────┘
       │                │
       │                ▼
       │        ┌───────────────┐
       │        │ Display cards │
       │        └───────┬───────┘
       │                │
       │                ▼
       │        ┌───────────────┐
       │        │ Click Upload  │
       │        └───────┬───────┘
       │                │
       │                ▼
       │        ┌───────────────┐
       │        │ Navigate to   │
       │        │    Step 2     │
       │        └───────┬───────┘
       │                │
       │                ▼
       │        ┌───────────────────────┐
       │        │   Step 2: OCR         │
       │        │                       │
       │        │ Batch upload logic:   │
       │        │ 1. Take first 5 files │
       │        │ 2. POST /upload       │
       │        │ 3. Wait for response  │
       │        │ 4. Update status      │
       │        │ 5. Repeat for next 5  │
       │        └───────┬───────────────┘
       │                │
       │                ├─ All Success ──┐
       │                │                 ▼
       │                │         ┌───────────────┐
       │                │         │ Enable Next   │
       │                │         │    Button     │
       │                │         └───────────────┘
       │                │
       │                └─ Any Error ────┐
       │                                 ▼
       │                         ┌───────────────┐
       │                         │  Error Toast  │
       │                         │  Show Back    │
       │                         └───────────────┘
       │
       └─ Invalid ──────┐
                        ▼
                ┌───────────────┐
                │  Error Toast  │
                └───────────────┘
```

### Step Navigation Flow

```
┌─────────────┐
│ Current     │
│ Step: N     │
└──────┬──────┘
       │
       ├─ Click Next ────────┐
       │                     ▼
       │             ┌───────────────┐
       │             │ Validate step │
       │             │  completion   │
       │             └───────┬───────┘
       │                     │
       │                     ├─ Valid ────┐
       │                     │             ▼
       │                     │     ┌───────────────┐
       │                     │     │ Update Redux  │
       │                     │     │ currentStep++ │
       │                     │     └───────┬───────┘
       │                     │             │
       │                     │             ▼
       │                     │     ┌───────────────┐
       │                     │     │ Slide animate │
       │                     │     │  to next step │
       │                     │     └───────────────┘
       │                     │
       │                     └─ Invalid ──┐
       │                                  ▼
       │                          ┌───────────────┐
       │                          │  Error Toast  │
       │                          └───────────────┘
       │
       └─ Click Back ────────┐
                             ▼
                     ┌───────────────┐
                     │ Update Redux  │
                     │ currentStep-- │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ Slide animate │
                     │ to prev step  │
                     └───────────────┘
```

---

## API Integration Layer

### Axios Configuration

```typescript
// api/axios.config.ts
import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      localStorage.removeItem('auth_token');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Endpoints

```typescript
// api/endpoints.ts

export const AUTH_ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/token',
};

export const FILE_ENDPOINTS = {
  UPLOAD: '/upload-files',
};

export const PROCESS_ENDPOINTS = {
  AUTOFILL: '/document/process',
};

export const DOWNLOAD_ENDPOINTS = {
  LIST: '/list',
};
```

---

## Security Architecture

### Token Management

```
┌─────────────────────────────────────────┐
│         Token Lifecycle                 │
├─────────────────────────────────────────┤
│                                         │
│  1. Login Success                       │
│     ↓                                   │
│  2. Receive JWT token                   │
│     ↓                                   │
│  3. Store in localStorage               │
│     ↓                                   │
│  4. Store in Redux (memory)             │
│     ↓                                   │
│  5. Attach to all API requests          │
│     ↓                                   │
│  6. Validate on protected routes        │
│     ↓                                   │
│  7. On 401: Clear & redirect to login   │
│     ↓                                   │
│  8. On logout: Clear both stores        │
│                                         │
└─────────────────────────────────────────┘
```

### Protected Route Guard

```typescript
// routes/ProtectedRoute.tsx

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem('auth_token');
  
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

### API Call Guard

```typescript
// Before any API call in steps
const checkAuth = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    showAuthWarningModal();
    return false;
  }
  return true;
};

// Usage
const handleUpload = () => {
  if (!checkAuth()) return;
  // Proceed with upload
};
```

---

## Performance Optimization

### Code Splitting Strategy

```typescript
// Lazy load pages
const RegisterPage = lazy(() => import('./pages/Register'));
const LoginPage = lazy(() => import('./pages/Login'));
const HomePage = lazy(() => import('./pages/Home'));

// Lazy load heavy components
const GoogleMap = lazy(() => import('./components/steps/RoadMap/GoogleMap'));
const DocxViewer = lazy(() => import('./components/steps/Preview/DocxViewer'));
```

### Bundle Optimization

```
Main Bundle (< 200KB)
├── React + ReactDOM
├── Redux Toolkit
├── React Router
└── Core components

Vendor Bundle (< 150KB)
├── Axios
├── React Hook Form
├── Zod
└── Utilities

Async Chunks
├── GoogleMap.chunk.js (loaded on Step 5)
├── DocxViewer.chunk.js (loaded on Step 4)
└── Lottie.chunk.js (loaded on Step 3)
```

### Caching Strategy

```typescript
// RTK Query cache configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Files', 'User'],
  endpoints: (builder) => ({
    // Cache for 5 minutes
    getUser: builder.query({
      query: () => '/user',
      providesTags: ['User'],
      keepUnusedDataFor: 300,
    }),
  }),
});
```

---

## Error Handling Strategy

### Error Boundary

```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error('Error:', error, errorInfo);
    // Show fallback UI
    this.setState({ hasError: true });
  }
}
```

### API Error Handling

```typescript
try {
  const response = await api.post('/upload', formData);
  return response.data;
} catch (error) {
  if (error.response) {
    // Server responded with error
    toast.error(error.response.data.message);
  } else if (error.request) {
    // No response received
    toast.error('Network error. Please check your connection.');
  } else {
    // Request setup error
    toast.error('An unexpected error occurred.');
  }
  throw error;
}
```

---

## Testing Strategy

### Unit Tests
- Form validation logic
- Redux reducers
- Utility functions
- API service functions

### Integration Tests
- Authentication flow
- File upload flow
- Step navigation
- API integration

### E2E Tests (Optional)
- Complete user journey
- Register → Login → Complete all steps

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Build Process                   │
├─────────────────────────────────────────┤
│                                         │
│  npm run build                          │
│     ↓                                   │
│  Vite builds optimized bundles          │
│     ↓                                   │
│  dist/                                  │
│  ├── index.html                         │
│  ├── assets/                            │
│  │   ├── index-[hash].js                │
│  │   ├── vendor-[hash].js               │
│  │   └── index-[hash].css               │
│  └── ...                                │
│     ↓                                   │
│  Deploy to:                             │
│  - Vercel / Netlify (recommended)       │
│  - AWS S3 + CloudFront                  │
│  - Nginx server                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## Environment Variables

```bash
# .env.example
VITE_API_BASE_URL=https://api.yourbackend.com
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_APP_NAME=Insurance Claims
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_FILES=50
```

---

*This architecture is designed for scalability, maintainability, and performance.*
