# Insurance Claiming Application - Project Plan

## 📋 Executive Summary
A modern, corporate-style insurance claiming web application with a 6-step document processing workflow. Built with React, TypeScript, and Tailwind CSS featuring glassmorphism design.

---

## 🎯 Core Requirements

### Pages (3)
1. **Register Page** - User registration with validation
2. **Login Page** - Authentication with token management
3. **Home Page** - 6-step claim processing workflow

### Features (6 Steps)
1. Upload Documents
2. OCR Extraction
3. AutoFill
4. Preview
5. Road Map
6. Download

---

## 🛠 Tech Stack

### Core Framework
- **React 18.3+** - UI library
- **TypeScript 5.x** - Type safety
- **Vite** - Build tool (faster than CRA)

### Styling & UI
- **Tailwind CSS 3.x** - Utility-first CSS
- **Headless UI** - Accessible UI components
- **Lucide React** - Modern icon library
- **Framer Motion** - Animation library

### State Management
- **Redux Toolkit** - Global state (markers, auth)
- **RTK Query** - API calls & caching

### Form Handling
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### File Handling
- **React Dropzone** - Drag & drop uploads
- **Axios** - HTTP client with interceptors

### Map Integration
- **@react-google-maps/api** - Google Maps React wrapper
- **@googlemaps/js-api-loader** - Maps API loader

### Document Preview
- **react-docx-preview** or **@cyntler/react-doc-viewer** - DOCX viewer
- **mammoth.js** - DOCX to HTML conversion (fallback)

### Animations & Loaders
- **Lottie React** - Lottie animations
- **React Hot Toast** - Toast notifications

### Utilities
- **html2canvas** - Map screenshot capture
- **date-fns** - Date formatting
- **clsx** - Conditional classNames

---

## 🎨 Design System

### Color Palette (Corporate & Professional)

#### Primary Colors
```css
--primary-50: #eff6ff    /* Light blue tint */
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6   /* Main brand color */
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a
```

#### Accent Colors
```css
--accent-cyan: #06b6d4    /* Success/Active states */
--accent-purple: #8b5cf6  /* Interactive elements */
--accent-amber: #f59e0b   /* Warnings */
--accent-red: #ef4444     /* Errors */
--accent-green: #10b981   /* Success */
```

#### Neutral/Glass Colors
```css
--glass-white: rgba(255, 255, 255, 0.1)
--glass-white-strong: rgba(255, 255, 255, 0.2)
--glass-dark: rgba(0, 0, 0, 0.1)
--glass-border: rgba(255, 255, 255, 0.18)
--backdrop-blur: blur(10px)
```

#### Text Colors
```css
--text-primary: #0f172a
--text-secondary: #475569
--text-muted: #94a3b8
--text-white: #ffffff
```

### Glassmorphism Style Guide
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.glass-card-strong {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Typography
- **Headings**: Inter, SF Pro Display (system font)
- **Body**: Inter, system-ui
- **Monospace**: JetBrains Mono, Fira Code

### Component Sizes
- **Border Radius**: 12px (cards), 8px (buttons), 6px (inputs)
- **Spacing Scale**: 4px base (4, 8, 12, 16, 24, 32, 48, 64)
- **Button Heights**: sm: 36px, md: 44px, lg: 52px

---

## 📐 Wireframe Structure

### Layout Hierarchy
```
App
├── AuthLayout (Register, Login)
│   ├── Glass Container (centered)
│   ├── Form Fields
│   └── CTA Buttons
│
└── MainLayout (Home)
    ├── Header
    │   ├── Logo + App Name
    │   └── User Menu / Auth CTAs
    │
    └── StepperWorkflow
        ├── StepIndicator (horizontal)
        ├── StepContent (dynamic)
        └── Navigation (Back/Next CTAs)
```

### Page Wireframes

#### 1. Register/Login Pages
```
┌─────────────────────────────────────┐
│                                     │
│     [Logo]  Insurance Claims        │
│                                     │
│   ┌───────────────────────────┐   │
│   │  Glass Card Container     │   │
│   │                           │   │
│   │  [Input Fields]           │   │
│   │  [Validation Messages]    │   │
│   │                           │   │
│   │  [Submit Button]          │   │
│   │                           │   │
│   │  [Alt Link: Login/Reg]    │   │
│   └───────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### 2. Home Page - Stepper Layout
```
┌──────────────────────────────────────────────┐
│ Header: [Logo] Insurance Claims    [User ▼] │
├──────────────────────────────────────────────┤
│                                              │
│  Step Indicator:                            │
│  ● ─── ○ ─── ○ ─── ○ ─── ○ ─── ○          │
│  Upload  OCR  Auto  Preview  Map  Download  │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  │     Step Content Container             │ │
│  │     (Dynamic based on active step)     │ │
│  │                                        │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  [Back]                          [Next] →   │
│                                              │
└──────────────────────────────────────────────┘
```

#### 3. Step 1 - Upload Documents
```
┌────────────────────────────────────┐
│  ┌──────────────────────────────┐ │
│  │  📁 Drag & Drop Files Here   │ │
│  │     or Click to Browse       │ │
│  └──────────────────────────────┘ │
│                                    │
│  Uploaded Files:                   │
│  ┌──────────────────────────────┐ │
│  │ 📄 document1.pdf    2.3 MB ✕ │ │
│  │ 📄 document2.jpg    1.8 MB ✕ │ │
│  └──────────────────────────────┘ │
│                                    │
│                      [Upload] →   │
└────────────────────────────────────┘
```

#### 4. Step 5 - Road Map
```
┌────────────────────────────────────┐
│  [Normal View] [Satellite View]    │
│                                    │
│  ┌──────────────────────────────┐ │
│  │                              │ │
│  │      Google Map              │ │
│  │      with SVG Markers        │ │
│  │                              │ │
│  └──────────────────────────────┘ │
│                                    │
│  Draggable Icons:                 │
│  🚗 🏍️ 💥 🚶                      │
│                                    │
│  [Clear] [Download Scene]         │
│  [← Back]              [Next →]   │
└────────────────────────────────────┘
```

---

## 🏗 Project Structure

```
src/
├── assets/
│   ├── icons/           # SVG icons for map markers
│   ├── lottie/          # Lottie animation files
│   └── images/          # Logo, backgrounds
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Loading.tsx
│   │   └── Toast.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   │
│   ├── auth/
│   │   ├── RegisterForm.tsx
│   │   └── LoginForm.tsx
│   │
│   └── steps/
│       ├── StepIndicator.tsx
│       ├── UploadDocuments.tsx
│       ├── OCRExtraction.tsx
│       ├── AutoFill.tsx
│       ├── Preview.tsx
│       ├── RoadMap.tsx
│       └── Download.tsx
│
├── pages/
│   ├── Register.tsx
│   ├── Login.tsx
│   └── Home.tsx
│
├── store/
│   ├── index.ts
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── stepperSlice.ts
│   │   └── markersSlice.ts
│   └── api/
│       └── apiSlice.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useFileUpload.ts
│   └── useMap.ts
│
├── utils/
│   ├── validation.ts
│   ├── fileHelpers.ts
│   ├── mapHelpers.ts
│   └── constants.ts
│
├── types/
│   ├── auth.types.ts
│   ├── file.types.ts
│   └── map.types.ts
│
├── routes/
│   ├── ProtectedRoute.tsx
│   └── index.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🔄 Application Flow

### Authentication Flow
```
1. App Loads
   ↓
2. Check localStorage for token
   ↓
   ├─ Token exists → Validate → Home Page
   └─ No token → Login Page
   
3. Register Flow:
   Register → Success Toast → Login Page → Enter Credentials → Store Token → Home
   
4. Login Flow:
   Login → Validate → Store Token → Home
   
5. Logout Flow:
   Click User Menu → Logout → Clear Token → Login Page
```

### Step Workflow
```
Step 1: Upload Documents
  ↓ (Upload CTA)
Step 2: OCR Extraction
  ↓ (Auto-upload files in batches of 5)
  ↓ (Next CTA after success)
Step 3: AutoFill
  ↓ (Auto-process, no CTA)
  ↓ (Auto-navigate on success)
Step 4: Preview
  ↓ (Confirm CTA)
Step 5: Road Map
  ↓ (Next CTA when markers added)
Step 6: Download
  ↓ (Download CTA)
  → Complete
```

### API Integration Points

#### Authentication APIs
```typescript
POST /register
  Body: { username, email, password }
  Response: { message, userId }

POST /token
  Body: { username, password }
  Response: { token, user: { id, username, email } }
```

#### File Processing APIs
```typescript
POST /upload-files
  Headers: { Authorization: "Bearer <token>" }
  Body: FormData (max 5 files)
  Response: { message, session_id, user_name, uploaded_files: [] }

POST /document/process/{session_id}
  Headers: { Authorization: "Bearer <token>" }
  Body: { session_id, template_filename }
  Response: { message, report_docx_gcs_uri, status }

GET /list/{session_id}
  Headers: { Authorization: "Bearer <token>" }
  Params: { session_id }
  Response: { message, url }
```

**Note**: All file processing endpoints require Bearer token authentication. The token is obtained from the `/token` (login) endpoint and automatically included in request headers via axios interceptor.

---

## 🔐 Security & Validation

### Form Validation Rules

#### Register Form
- **Username**: 3-20 chars, alphanumeric + underscore
- **Email**: Valid email format
- **Password**: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- **Confirm Password**: Must match password

#### Login Form
- **Username**: Required, min 3 chars
- **Password**: Required, min 8 chars

### File Upload Validation
- **Max file size**: 10MB per file
- **Allowed types**: PDF, JPG, JPEG, PNG, DOCX
- **Max files**: 50 files per session

### API Security
- **Token Storage**: localStorage (key: 'auth_token')
- **API Interceptor**: Attach token to all requests
- **401 Handler**: Clear token, redirect to login
- **Request Guard**: Block API calls if not authenticated

---

## 🎬 Animation Specifications

### Page Transitions
- **Fade In**: 300ms ease-in-out
- **Slide Up**: 400ms ease-out (forms)

### Step Transitions
- **Slide Left/Right**: 500ms cubic-bezier(0.4, 0, 0.2, 1)
- **Step Indicator**: Progress bar animation 600ms

### Micro-interactions
- **Button Hover**: Scale 1.02, 200ms
- **File Card**: Fade in + slide up, stagger 100ms
- **Toast**: Slide in from top, 300ms
- **Loading**: Lottie animation loop

### Lottie Animations
- **OCR Extraction**: Document scanning animation
- **AutoFill**: Data processing/loading animation
- **Success**: Checkmark animation

---

## 📦 Implementation Plan

### Phase 1: Project Setup (Day 1)
1. ✅ Initialize Vite + React + TypeScript
2. ✅ Install dependencies
3. ✅ Configure Tailwind CSS
4. ✅ Setup folder structure
5. ✅ Configure Redux store
6. ✅ Setup routing

### Phase 2: Design System (Day 1-2)
1. ✅ Create glassmorphism CSS utilities
2. ✅ Build common components (Button, Input, GlassCard)
3. ✅ Create layout components (Header, AuthLayout)
4. ✅ Setup theme configuration

### Phase 3: Authentication (Day 2-3)
1. ✅ Build Register page with validation
2. ✅ Build Login page with validation
3. ✅ Implement auth state management
4. ✅ Create protected routes
5. ✅ Setup API interceptors
6. ✅ Implement token management

### Phase 4: Home Page Structure (Day 3-4)
1. ✅ Build stepper indicator component
2. ✅ Create step navigation logic
3. ✅ Setup step state management
4. ✅ Build header with user menu

### Phase 5: Step 1 - Upload Documents (Day 4)
1. ✅ Implement drag & drop zone
2. ✅ File validation
3. ✅ File list display with cards
4. ✅ Remove file functionality

### Phase 6: Step 2 - OCR Extraction (Day 5)
1. ✅ Batch upload logic (5 files at a time)
2. ✅ Loading states per file
3. ✅ Error handling
4. ✅ Success/failure feedback

### Phase 7: Step 3 - AutoFill (Day 5)
1. ✅ Lottie animation integration
2. ✅ Auto-trigger API call
3. ✅ Auto-navigation on success
4. ✅ Error handling

### Phase 8: Step 4 - Preview (Day 6)
1. ✅ DOCX preview component
2. ✅ Readonly document viewer
3. ✅ Scroll functionality
4. ✅ Confirm button

### Phase 9: Step 5 - Road Map (Day 6-7)
1. ✅ Google Maps integration
2. ✅ Location access
3. ✅ View toggle (normal/satellite)
4. ✅ Draggable SVG markers
5. ✅ Marker position tracking
6. ✅ Redux state for markers
7. ✅ Screenshot/download scene
8. ✅ Clear markers functionality

### Phase 10: Step 6 - Download (Day 7)
1. ✅ Download API integration
2. ✅ File download logic
3. ✅ Success feedback

### Phase 11: Polish & Testing (Day 8)
1. ✅ Toast notifications
2. ✅ Loading states
3. ✅ Error boundaries
4. ✅ Responsive design
5. ✅ Browser testing
6. ✅ Performance optimization

---

## 🎯 Key Technical Decisions

### Why Vite over CRA?
- 10x faster dev server
- Instant HMR
- Better TypeScript support
- Smaller bundle size

### Why Redux Toolkit?
- Centralized state for markers (needed across steps)
- RTK Query for API caching
- DevTools for debugging

### Why React Hook Form + Zod?
- Better performance (less re-renders)
- Type-safe validation
- Smaller bundle than Formik

### Why Headless UI?
- Fully accessible
- Unstyled (perfect for custom glass design)
- Maintained by Tailwind team

---

## 🚀 Getting Started Commands

```bash
# Initialize project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install core dependencies
npm install react-router-dom @reduxjs/toolkit react-redux
npm install react-hook-form zod @hookform/resolvers
npm install axios react-hot-toast
npm install framer-motion lucide-react
npm install react-dropzone
npm install @react-google-maps/api
npm install lottie-react
npm install html2canvas
npm install @headlessui/react
npm install clsx date-fns

# Install dev dependencies
npm install -D @types/node

# Start dev server
npm run dev
```

---

## 📊 Success Metrics

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)

### User Experience
- **Form validation**: Real-time feedback
- **File upload**: Progress indication
- **API errors**: Clear error messages
- **Loading states**: Smooth animations

---

## 🔮 Future Enhancements (Post-MVP)

1. **Multi-language support** (i18n)
2. **Dark mode toggle**
3. **Email verification**
4. **Password reset flow**
5. **File preview before upload**
6. **Drag to reorder files**
7. **Save draft functionality**
8. **Export map as PDF**
9. **Mobile responsive optimization**
10. **PWA support**

---

## 📝 Notes

- All API endpoints are placeholders - update with actual backend URLs
- Google Maps API key required (add to .env)
- Lottie files need to be sourced from LottieFiles
- SVG marker icons need to be created/sourced
- Consider rate limiting for API calls
- Implement proper error logging (Sentry/LogRocket)

---

**Project Timeline**: 8 days (MVP)  
**Team Size**: 1 developer (you as CTO + developer)  
**Complexity**: Medium-High  
**Risk Areas**: Google Maps integration, DOCX preview, batch file uploads

---

*This plan is a living document. Update as requirements evolve.*
