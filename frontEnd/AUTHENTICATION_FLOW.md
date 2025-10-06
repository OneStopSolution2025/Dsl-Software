# Authentication & Authorization Flow

## 🔐 Overview

This application uses **JWT (JSON Web Token)** based authentication with **Bearer token** authorization for all protected API endpoints.

---

## 📋 Authentication Flow

### 1. User Registration
```
User fills registration form
  ↓
POST /register
  Body: { username, email, password }
  ↓
Backend creates user
  ↓
Response: { message: "Success", userId: "..." }
  ↓
Frontend shows success toast
  ↓
Auto-redirect to /login
```

### 2. User Login
```
User fills login form
  ↓
POST /token
  Body: { username, password }
  ↓
Backend validates credentials
  ↓
Response: { token: "eyJhbGc...", user: { id, username, email } }
  ↓
Frontend stores token in localStorage (key: 'auth_token')
  ↓
Frontend stores user data in Redux store
  ↓
Auto-redirect to / (Home page)
```

### 3. Token Persistence
```
User refreshes page or returns later
  ↓
App checks localStorage for 'auth_token'
  ↓
Token exists?
  ├─ YES → Set isAuthenticated = true → Allow access to Home
  └─ NO → Redirect to /login
```

### 4. Authenticated API Requests
```
User performs action requiring API call
  ↓
Axios interceptor automatically adds header:
  Authorization: Bearer <token>
  ↓
Request sent to backend
  ↓
Backend validates token
  ├─ Valid → Process request → Return response
  └─ Invalid/Expired → Return 401 Unauthorized
      ↓
      Frontend intercepts 401
      ↓
      Clear localStorage & Redux
      ↓
      Show "Session expired" toast
      ↓
      Redirect to /login
```

### 5. User Logout
```
User clicks Logout
  ↓
Frontend clears localStorage ('auth_token')
  ↓
Frontend clears Redux auth state
  ↓
Redirect to /login
```

---

## 🔑 Token Management

### Storage Location
- **localStorage** with key: `auth_token`
- **Redux store** for runtime access

### Token Format
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Lifecycle
1. **Received**: From `/token` endpoint after successful login
2. **Stored**: In localStorage and Redux store
3. **Used**: Automatically added to all API requests via axios interceptor
4. **Validated**: By backend on each protected endpoint
5. **Cleared**: On logout or 401 error

---

## 🛡️ Protected Endpoints

### Endpoints Requiring Bearer Token

#### 1. Upload Files
```typescript
POST /upload-files
Headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'multipart/form-data'
}
Body: FormData (files)
Response: { 
  message: string,
  session_id: string,      // ← Store this for subsequent requests
  user_name: string,
  uploaded_files: string[]
}
```

#### 2. Process Documents
```typescript
POST /document/process/{session_id}
Headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
Body: {
  session_id: string,
  template_filename: string
}
Response: {
  message: string,
  report_docx_gcs_uri: string,  // ← DOCX file URL
  status: string
}
```

#### 3. Download Final Document
```typescript
GET /list/{session_id}
Headers: {
  'Authorization': 'Bearer <token>'
}
Params: {
  session_id: string
}
Response: {
  message: string,
  url: string  // ← Final document download URL
}
```

---

## 🔧 Implementation Details

### Axios Interceptor (Automatic Token Injection)

**File**: `src/utils/axios.config.ts`

```typescript
// Request interceptor - Automatically adds Bearer token
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

// Response interceptor - Handles 401 errors
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
```

### Manual Token Addition (When Needed)

Even though the interceptor adds the token automatically, we explicitly add it in file upload requests to ensure it's included:

**OCR Extraction** (`src/components/steps/OCRExtraction.tsx`):
```typescript
const token = localStorage.getItem('auth_token');

const response = await api.post(API_ENDPOINTS.FILES.UPLOAD, formData, {
  headers: { 
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`,
  },
});
```

**AutoFill** (`src/components/steps/AutoFill.tsx`):
```typescript
const token = localStorage.getItem('auth_token');

const response = await api.post(
  `${API_ENDPOINTS.PROCESS.AUTOFILL}/${sessionId}`, 
  { session_id: sessionId, template_filename: 'default_template.docx' },
  { headers: { 'Authorization': `Bearer ${token}` } }
);
```

**Download** (`src/components/steps/Download.tsx`):
```typescript
const token = localStorage.getItem('auth_token');

const response = await api.get(`${API_ENDPOINTS.DOWNLOAD.LIST}/${sessionId}`, {
  params: { session_id: sessionId },
  headers: { 'Authorization': `Bearer ${token}` },
});
```

---

## 📊 Session Management

### Session ID Flow

```
Step 2: OCR Extraction
  ↓
Upload files to /upload-files
  ↓
Receive session_id in response
  ↓
Store in Redux: filesSlice.sessionId
  ↓
Step 3: AutoFill
  ↓
Use session_id in /document/process/{session_id}
  ↓
Step 6: Download
  ↓
Use session_id in /list/{session_id}
```

### Redux State Structure

```typescript
// Auth State
{
  auth: {
    user: { id, username, email } | null,
    token: string | null,
    isAuthenticated: boolean
  }
}

// Files State
{
  files: {
    sessionId: string | null,        // ← From /upload-files
    userName: string | null,
    uploadedFiles: [...],
    docxUrl: string | null,          // ← From /document/process
    finalDocxUrl: string | null      // ← From /list
  }
}
```

---

## 🔒 Security Best Practices

### ✅ Implemented
1. **Token stored in localStorage** - Persists across sessions
2. **Token in Redux** - Fast runtime access
3. **Automatic token injection** - Via axios interceptor
4. **401 handling** - Auto-logout on expired token
5. **Protected routes** - Redirect to login if not authenticated
6. **HTTPS recommended** - For production deployment

### ⚠️ Important Notes
1. **Token expiration**: Backend should implement token expiration
2. **Refresh tokens**: Consider implementing for better UX
3. **HTTPS only**: Never send tokens over HTTP in production
4. **XSS protection**: React automatically escapes output
5. **CSRF protection**: Consider implementing for state-changing operations

---

## 🧪 Testing Authentication

### Test Scenarios

#### 1. Registration Flow
```bash
# Test registration
POST http://localhost:3000/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234"
}

# Expected: 200 OK
# Response: { message: "Success", userId: "..." }
```

#### 2. Login Flow
```bash
# Test login
POST http://localhost:3000/token
{
  "username": "testuser",
  "password": "Test1234"
}

# Expected: 200 OK
# Response: { 
#   token: "eyJhbGc...", 
#   user: { id: "...", username: "testuser", email: "test@example.com" }
# }
```

#### 3. Protected Endpoint
```bash
# Test file upload with token
POST http://localhost:3000/upload-files
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}
Body: FormData with files

# Expected: 200 OK
# Response: { session_id: "...", uploaded_files: [...] }
```

#### 4. Invalid Token
```bash
# Test with invalid token
POST http://localhost:3000/upload-files
Headers: {
  "Authorization": "Bearer invalid_token"
}

# Expected: 401 Unauthorized
# Frontend should auto-logout and redirect to /login
```

---

## 🐛 Troubleshooting

### Issue: Token not being sent
**Check**:
1. Token exists in localStorage: `localStorage.getItem('auth_token')`
2. Axios interceptor is configured
3. Network tab shows Authorization header

### Issue: 401 errors on all requests
**Check**:
1. Token is valid (not expired)
2. Token format is correct: `Bearer <token>`
3. Backend is validating tokens correctly

### Issue: Token persists but user logged out
**Check**:
1. Redux state is initialized with token from localStorage
2. `isAuthenticated` flag is set correctly
3. Protected route checks both localStorage and Redux

### Issue: CORS errors with Authorization header
**Backend must allow**:
```javascript
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

## 📝 Backend Requirements

Your backend must implement:

### 1. Token Generation (Login)
```python
# Example (Python/Flask)
from flask_jwt_extended import create_access_token

@app.route('/token', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    # Validate credentials
    user = validate_user(username, password)
    if not user:
        return {'message': 'Invalid credentials'}, 401
    
    # Create token
    token = create_access_token(identity=user.id)
    
    return {
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }
```

### 2. Token Validation (Protected Endpoints)
```python
from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route('/upload-files', methods=['POST'])
@jwt_required()  # ← Validates Bearer token
def upload_files():
    user_id = get_jwt_identity()
    files = request.files.getlist('files')
    
    # Process files
    session_id = create_session(user_id)
    
    return {
        'session_id': session_id,
        'user_name': get_user_name(user_id),
        'uploaded_files': [...]
    }
```

---

## ✅ Summary

- **Login** → Get token from `/token`
- **Store** → localStorage + Redux
- **Use** → Automatically added to all requests via interceptor
- **Validate** → Backend checks token on protected endpoints
- **Handle 401** → Auto-logout and redirect to login
- **Session ID** → Obtained from `/upload-files`, used in subsequent steps

**All file processing endpoints require Bearer token authentication!**

---

*Last Updated: October 5, 2025*
