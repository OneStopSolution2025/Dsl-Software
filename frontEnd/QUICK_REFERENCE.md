# Quick Reference Card

## 🚀 Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build

# Dependencies
npm install              # Install all dependencies
npm install <package>    # Add new package
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (API URL, Google Maps key) |
| `src/App.tsx` | Root component with Redux Provider |
| `src/routes/index.tsx` | Route configuration |
| `src/store/index.ts` | Redux store setup |
| `tailwind.config.js` | Tailwind configuration |

## 🔑 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_APP_NAME=Insurance Claims
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_FILES=50
```

## 🛣️ Routes

| Route | Page | Protected |
|-------|------|-----------|
| `/register` | Register | No |
| `/login` | Login | No |
| `/` | Home (6 steps) | Yes |

## 🗂️ Redux Slices

| Slice | State | Purpose |
|-------|-------|---------|
| `auth` | user, token, isAuthenticated | Authentication |
| `stepper` | currentStep, completedSteps | Step navigation |
| `files` | uploadedFiles, sessionId | File management |
| `markers` | items | Map markers |

## 📡 API Endpoints

```typescript
// Authentication
POST /register          // Register new user
POST /token            // Login and get token

// File Processing
POST /upload-files     // Upload files (max 5)
POST /document/process/{session_id}  // Process documents
GET /list/{session_id} // Get final document
```

## 🎨 Common Components

```tsx
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { GlassCard } from '@/components/common/GlassCard';
import { Loading } from '@/components/common/Loading';

// Usage
<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>

<Input 
  label="Username" 
  error="Error message"
  glass={true}
/>

<GlassCard strong={false}>
  Content
</GlassCard>

<Loading size="md" text="Loading..." />
```

## 🪝 Custom Hooks

```tsx
import { useAuth } from '@/hooks/useAuth';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useMap } from '@/hooks/useMap';

// Usage
const { isAuthenticated, user } = useAuth();
const { handleFilesAdded, handleFileRemoved } = useFileUpload();
const { markers, handleAddMarker } = useMap();
```

## 🎯 Redux Actions

```tsx
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '@/store/slices/authSlice';
import { nextStep, previousStep } from '@/store/slices/stepperSlice';
import { addFiles, removeFile } from '@/store/slices/filesSlice';
import { addMarker, clearMarkers } from '@/store/slices/markersSlice';

const dispatch = useDispatch();
dispatch(nextStep());
```

## 🎨 Tailwind Classes

```css
/* Glass Effects */
.glass-card              /* Standard glass card */
.glass-card-strong       /* Stronger glass effect */
.glass-input             /* Glass input field */

/* Buttons */
.btn-primary             /* Primary button */
.btn-secondary           /* Secondary button */

/* Gradients */
.bg-gradient-primary     /* Purple to blue */
.bg-gradient-blue        /* Blue gradient */
.bg-gradient-subtle      /* Subtle background */
```

## 🔧 Utilities

```tsx
import { formatFileSize } from '@/utils/fileHelpers';
import { validateFile } from '@/utils/fileHelpers';
import { getCurrentLocation } from '@/utils/mapHelpers';
import { API_ENDPOINTS, STEPS } from '@/utils/constants';

// Usage
formatFileSize(1024000);  // "1 MB"
validateFile(file);       // { valid: true }
getCurrentLocation();     // Promise<{lat, lng}>
```

## 📝 TypeScript Types

```tsx
import type { User, LoginCredentials } from '@/types/auth.types';
import type { UploadedFile } from '@/types/file.types';
import type { MapMarker, MarkerType } from '@/types/map.types';
import type { StepNumber } from '@/types/stepper.types';
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Maps not loading | Add Google Maps API key to `.env` |
| Build fails | Run `npm install` |
| Token not persisting | Check localStorage in browser |
| CORS errors | Configure backend CORS settings |

## 📦 Package Management

```bash
# Add new dependency
npm install package-name

# Add dev dependency
npm install -D package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

## 🎯 Step Flow

```
1. Upload Documents → User uploads files
2. OCR Extraction → Batch upload (5 at a time)
3. AutoFill → Backend processing (auto-navigate)
4. Preview → View generated DOCX
5. Road Map → Mark incident locations
6. Download → Download final document
```

## 🔐 Authentication Flow

```
Register → Success Toast → Login → Store Token → Home
                                      ↓
                              Check Token on Load
                                      ↓
                              Valid? → Home
                              Invalid? → Login
```

## 📊 File Structure Quick View

```
src/
├── components/    # UI components
├── pages/         # Page components
├── store/         # Redux store
├── hooks/         # Custom hooks
├── utils/         # Utilities
├── types/         # TypeScript types
└── routes/        # Routing
```

---

**Pro Tip**: Keep this file open while developing for quick reference!
