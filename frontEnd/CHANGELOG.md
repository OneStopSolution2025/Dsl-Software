# Changelog

## [1.0.1] - 2025-10-05

### 🔐 Enhanced Authentication & Authorization

#### Added
- **Bearer Token Authorization** for all protected file processing endpoints
  - `/upload-files` - Now requires `Authorization: Bearer <token>` header
  - `/document/process/{session_id}` - Now requires `Authorization: Bearer <token>` header
  - `/list/{session_id}` - Now requires `Authorization: Bearer <token>` header

#### Changed
- **OCRExtraction Component** (`src/components/steps/OCRExtraction.tsx`)
  - Explicitly adds Bearer token to file upload requests
  - Properly extracts and stores `session_id` from API response
  - Enhanced error handling for authentication failures

- **AutoFill Component** (`src/components/steps/AutoFill.tsx`)
  - Adds Bearer token to document processing requests
  - Uses session_id from Redux store for API calls

- **Download Component** (`src/components/steps/Download.tsx`)
  - Adds Bearer token to download requests
  - Uses session_id from Redux store for API calls

- **Axios Configuration** (`src/utils/axios.config.ts`)
  - Enhanced request interceptor with clearer comments
  - Automatically adds Bearer token to all authenticated requests

#### Documentation Updates
- **PROJECT_PLAN.md** - Updated API endpoint documentation with Authorization headers
- **GETTING_STARTED.md** - Added authentication requirements for file endpoints
- **PROJECT_SUMMARY.md** - Updated API documentation with Bearer token info
- **AUTHENTICATION_FLOW.md** - New comprehensive authentication guide

### 📋 Session Management

#### Improved
- Session ID is now properly captured from the first `/upload-files` response
- Session ID is stored in Redux (`filesSlice.sessionId`)
- Session ID is used consistently across all subsequent API calls:
  - Step 3 (AutoFill): `/document/process/{session_id}`
  - Step 6 (Download): `/list/{session_id}`

### 🔧 Technical Details

#### Token Flow
1. User logs in via `/token` endpoint
2. Token stored in localStorage (key: `auth_token`)
3. Token stored in Redux store (`authSlice.token`)
4. Axios interceptor automatically adds token to all requests
5. Protected endpoints validate token on backend
6. 401 responses trigger auto-logout and redirect to login

#### Session Flow
1. Files uploaded to `/upload-files` (Step 2)
2. Response contains `session_id`
3. Session ID stored in Redux
4. Session ID used in `/document/process/{session_id}` (Step 3)
5. Session ID used in `/list/{session_id}` (Step 6)

### ✅ Testing
- Build successful: ✅
- TypeScript compilation: ✅
- All components updated: ✅
- Documentation updated: ✅

---

## [1.0.0] - 2025-10-05

### 🎉 Initial Release

#### Features
- Complete authentication system (Register, Login, Protected Routes)
- 6-step insurance claim workflow
- Modern glassmorphism UI design
- Redux state management
- Google Maps integration
- File upload with drag & drop
- Document preview and download
- Toast notifications
- Loading states and error handling
- Responsive design

#### Tech Stack
- React 18.3 + TypeScript 5.x
- Vite build tool
- Tailwind CSS 3.x
- Redux Toolkit
- React Router
- React Hook Form + Zod
- Axios
- Google Maps API
- Framer Motion
- React Hot Toast

#### Documentation
- PROJECT_PLAN.md
- TECHNICAL_ARCHITECTURE.md
- DESIGN_SYSTEM.md
- IMPLEMENTATION_GUIDE.md
- WIREFRAMES.md
- GETTING_STARTED.md
- PROJECT_SUMMARY.md
- QUICK_REFERENCE.md
- README.md

---

**Version Format**: [Major.Minor.Patch]
- **Major**: Breaking changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, documentation updates
