# Developer Guide - Insurance Claims Application

Complete technical documentation for developers working on this project.

---

## 📋 Table of Contents

1. [Development Setup](#development-setup)
2. [Architecture Overview](#architecture-overview)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Service Layer](#api-service-layer)
5. [State Management](#state-management)
6. [Component Library](#component-library)
7. [Map System](#map-system)
8. [Rich Text Editor](#rich-text-editor)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Development Setup

### Prerequisites
```bash
Node.js 18+
npm or yarn
Google Maps API Key
Backend API running
```

### Installation Steps

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Required Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_APP_NAME=Insurance Claims
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_FILES=50
```

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  Router → Auth Guard → Pages → Components                   │
│                    ↓                                          │
│            Redux Store (Auth, Files, Markers)               │
│                    ↓                                          │
│            API Layer (Axios + Interceptors)                 │
│                    ↓                                          │
└────────────────────┼───────────────────────────────────────┘
                     │ HTTPS + Bearer Token
                     ↓
┌────────────────────────────────────────────────────────────┐
│                    Backend API                              │
│  /register, /token, /upload-files, /document/process       │
└────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── Router
│   ├── Public Routes (/register, /login)
│   │   └── AuthLayout
│   │       ├── RegisterForm
│   │       └── LoginForm
│   │
│   └── Protected Routes (/)
│       └── MainLayout
│           ├── Header (with logout)
│           └── StepperWorkflow
│               ├── StepIndicator
│               └── Steps 1-6
│                   ├── UploadDocuments
│                   ├── OCRExtraction
│                   ├── AutoFill
│                   ├── Preview (with EditForm)
│                   ├── RoadMap (with Map & Markers)
│                   └── Download
```

### Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication forms
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthSidebar.tsx
│   ├── common/            # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Loading.tsx
│   │   ├── Tabs.tsx
│   │   └── Popup.tsx
│   ├── editor/            # Rich text editors
│   │   └── CustomRichTextEditor.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── AuthLayout.tsx
│   ├── map/               # Map-related components
│   │   ├── GoogleMapComponent.tsx
│   │   ├── IconPalette.tsx
│   │   ├── CustomMarker.tsx
│   │   ├── TransformControls.tsx
│   │   ├── MarkerList.tsx
│   │   ├── MapIconsSVG.tsx
│   │   └── enhancedMapIcons.ts
│   └── steps/             # 6-step workflow
│       ├── StepIndicator.tsx
│       ├── UploadDocuments.tsx
│       ├── OCRExtraction.tsx
│       ├── AutoFill.tsx
│       ├── Preview.tsx
│       ├── EditForm.tsx
│       ├── RoadMap2.tsx
│       └── Download.tsx
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   ├── useFileUpload.ts
│   └── useSessionManager.ts
├── pages/                 # Page components
│   ├── Register.tsx
│   ├── Login.tsx
│   ├── Home.tsx
│   └── MapEditor.tsx
├── routes/                # Routing configuration
│   ├── index.tsx
│   └── ProtectedRoute.tsx
├── services/              # API layer
│   └── api.service.ts
├── store/                 # Redux state management
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── filesSlice.ts
│       ├── markersSlice.ts
│       └── stepperSlice.ts
├── types/                 # TypeScript definitions
│   ├── auth.types.ts
│   ├── file.types.ts
│   ├── map.types.ts
│   └── stepper.types.ts
└── utils/                 # Helper functions
    ├── axios.config.ts
    ├── validation.ts
    ├── fileHelpers.ts
    ├── mapHelpers.ts
    └── constants.ts
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow

1. **Login Process**
```typescript
POST /token
Body: { username, password }
Response: { token: "eyJhbGc...", user: {...} }

// Token stored in:
- localStorage (key: 'auth_token')
- Redux store (authSlice)
```

2. **Token Usage**
```typescript
// Automatic via axios interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

3. **Token Expiry Handling**
```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      toast.error('Session expired');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Protected Endpoints

All file processing endpoints require Bearer token:
- `POST /upload-files`
- `POST /document/process/{session_id}`
- `GET /list/{session_id}`

---

## 🔌 API Service Layer

### Service Structure

**Location**: `src/services/api.service.ts`

```typescript
const apiService = {
  auth: {
    login(username, password)
    register(username, email, password)
    getUserProfile()
  },
  file: {
    uploadFiles(files, sessionId, onUploadProgress?)
    uploadScreenshot(file, sessionId)
  },
  document: {
    getTemplateList()
    processDocuments(sessionId, templateFilename?)
    saveEditedForm(sessionId, formData, templatePath?)
  }
};
```

### Usage Examples

```typescript
// Login
const { access_token } = await apiService.auth.login(username, password);
localStorage.setItem('auth_token', access_token);

// Upload files with progress
await apiService.file.uploadFiles(files, sessionId, (progress) => {
  console.log(`Progress: ${progress}%`);
});

// Process documents
const result = await apiService.document.processDocuments(sessionId);
```

---

## 🗂️ State Management

### Redux Store Structure

```typescript
{
  auth: {
    user: { id, username, email } | null,
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  
  stepper: {
    currentStep: 1-6,
    completedSteps: number[],
    canProceed: boolean
  },
  
  files: {
    uploadedFiles: Array<{
      id, name, size, file, status, progress
    }>,
    sessionId: string | null,
    docxUrl: string | null,
    htmlUrl: string | null
  },
  
  markers: {
    items: Array<{
      id, icon_type, latitude, longitude,
      scale, rotation, flip_horizontal,
      flip_vertical, color
    }>
  }
}
```

### Common Actions

```typescript
// Auth
dispatch(setCredentials({ user, token }));
dispatch(logout());

// Stepper
dispatch(setCurrentStep(2));
dispatch(nextStep());
dispatch(previousStep());

// Files
dispatch(addFiles(files));
dispatch(updateFileProgress({ id, progress }));
dispatch(setSessionId(sessionId));

// Markers
dispatch(addMarker(marker));
dispatch(updateMarker({ id, updates }));
dispatch(deleteMarker(id));
dispatch(clearAllMarkers());
```

---

## 🎨 Component Library

### Common Components

#### Button
```tsx
<Button 
  variant="primary" | "secondary" | "danger"
  size="sm" | "md" | "lg"
  loading={boolean}
  disabled={boolean}
  onClick={handler}
>
  Click Me
</Button>
```

#### Input
```tsx
<Input
  label="Username"
  type="text"
  error="Error message"
  glass={true}
  {...register('username')}
/>
```

#### GlassCard
```tsx
<GlassCard strong={boolean}>
  Content with glassmorphism effect
</GlassCard>
```

#### Loading
```tsx
<Loading size="sm" | "md" | "lg" text="Loading..." />
```

### Design Tokens

#### Colors
```css
--primary-500: #3b82f6    /* Main brand */
--accent-cyan: #06b6d4    /* Success */
--accent-red: #ef4444     /* Errors */
--accent-green: #10b981   /* Success states */
--accent-amber: #f59e0b   /* Warnings */
```

#### Glass Effects
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

---

## 🗺️ Map System

### Icon System (30+ Icons)

**Categories**:
- Vehicles (6): car, bike, pickup-truck, lorry, van, bus
- Pedestrians (3): man, woman, child
- Direction (3): arrow-straight, arrow-turn, blast
- Environment (3): tree, grass-verge, drain
- Traffic (6): traffic-light, cctv, pedestrian-crossing, yellow-box, no-entry, one-way
- Buildings (5): school, shops, factory, bus-stop, office-building

### Marker Features

1. **Placement**: Drag from palette or click icon then click map
2. **Transform**: Rotate, scale, flip horizontal/vertical
3. **Color**: 12 presets + custom color picker
4. **Default Colors**: Each icon has meaningful default
5. **Visual Indicators**: Color dots in marker list

### Implementation

```typescript
// Add marker
dispatch(addMarker({
  id: generateId(),
  icon_type: 'car',
  latitude: lat,
  longitude: lng,
  scale: 1,
  rotation: 0,
  flip_horizontal: false,
  flip_vertical: false,
  color: '#3B82F6'
}));

// Update marker color
dispatch(updateMarker({
  id: markerId,
  updates: { color: '#EF4444' }
}));
```

---

## 📝 Rich Text Editor

### Custom HTML Editor

**Features**:
- Text formatting (bold, italic, underline, strikethrough)
- Headers (H1, H2, H3)
- Lists and blockquotes
- Text alignment
- Color and background
- Links, images, tables
- Save to server

### Integration

```typescript
// Load HTML content
const [htmlContent, setHtmlContent] = useState('');

useEffect(() => {
  if (htmlUrl) {
    fetch(htmlUrl)
      .then(res => res.text())
      .then(setHtmlContent);
  }
}, [htmlUrl]);

// Save edited content
const handleSave = async () => {
  const file = new File([htmlContent], 'edited.html');
  await apiService.file.uploadFiles([file], sessionId);
};
```

---

## 🚀 Deployment

### Production Build

```bash
# Build
npm run build

# Output: dist/ folder
```

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_GOOGLE_MAPS_API_KEY
vercel env add VITE_API_BASE_URL
```

### Nginx Deployment

1. **Build application**
```bash
npm run build
```

2. **Copy to server**
```bash
scp -r dist/* user@server:/var/www/app/
```

3. **Configure nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/app;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

4. **SSL with Let's Encrypt**
```bash
sudo certbot --nginx -d your-domain.com
```

---

## 🐛 Troubleshooting

### Common Issues

**Google Maps not loading**
- Check API key in `.env`
- Enable "Maps JavaScript API" in Google Cloud Console
- Check browser console for errors

**File upload fails**
- Verify backend CORS settings
- Check file size limits (default 10MB)
- Ensure session ID is set

**Token issues**
- Check localStorage for `auth_token`
- Verify token format: `Bearer eyJ...`
- Check axios interceptor is configured

**Build errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`
- Update dependencies: `npm update`

### Debug Tools

```typescript
// View Redux state
console.log(store.getState());

// Check auth token
console.log(localStorage.getItem('auth_token'));

// Monitor API calls
api.interceptors.request.use(config => {
  console.log('Request:', config);
  return config;
});
```

---

## 📚 Additional Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **React Router**: https://reactrouter.com/
- **Google Maps API**: https://developers.google.com/maps/documentation

---

## 📞 Development Support

For questions or issues:
1. Check troubleshooting section
2. Review component documentation
3. Check browser console for errors
4. Verify environment variables

---

**Last Updated**: January 2026
**Version**: 1.0.1
