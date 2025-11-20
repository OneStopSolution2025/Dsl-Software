# API Service Consolidation

All API calls have been centralized into a single service file for better maintainability and reusability.

## Service Location
**File:** `/frontEnd/src/services/api.service.ts`

## API Categories

### 1. Authentication APIs (`apiService.auth`)
- **`login(username, password)`** - User login with OAuth2 flow
- **`register(username, email, password)`** - User registration
- **`getUserProfile()`** - Fetch authenticated user profile

### 2. File APIs (`apiService.file`)
- **`uploadFiles(files, sessionId, onUploadProgress?)`** - Upload multiple files with progress tracking
- **`uploadScreenshot(file, sessionId)`** - Upload single screenshot file

### 3. Document APIs (`apiService.document`)
- **`getTemplateList()`** - Fetch available document templates
- **`processDocuments(sessionId, templateFilename?)`** - Process documents with OCR/AutoFill
- **`saveEditedForm(sessionId, formData, templatePath?)`** - Save edited form and regenerate document

## Usage Examples

### Authentication
```typescript
import apiService from '@/services/api.service';

// Login
const response = await apiService.auth.login('username', 'password');
const token = response.access_token;

// Register
await apiService.auth.register('username', 'email@example.com', 'password');

// Get Profile
const user = await apiService.auth.getUserProfile();
```

### File Upload
```typescript
import apiService from '@/services/api.service';

// Upload multiple files with progress
const response = await apiService.file.uploadFiles(
  files,
  sessionId,
  (progress) => console.log(`Upload progress: ${progress}%`)
);

// Upload screenshot
const result = await apiService.file.uploadScreenshot(file, sessionId);
```

### Document Processing
```typescript
import apiService from '@/services/api.service';

// Get templates
const templates = await apiService.document.getTemplateList();

// Process documents
const result = await apiService.document.processDocuments(sessionId, templateFilename);

// Save edited form
const response = await apiService.document.saveEditedForm(sessionId, formData);
```

## Updated Files

### Components
- ✅ `LoginForm.tsx` - Uses `apiService.auth.login()`
- ✅ `RegisterForm.tsx` - Uses `apiService.auth.register()`
- ✅ `AutoFill.tsx` - Uses `apiService.document.*` methods
- ✅ `EditForm.tsx` - Uses `apiService.document.saveEditedForm()`
- ✅ `UploadMore.tsx` - Uses `apiService.file.uploadFiles()`
- ✅ `OCRExtraction.tsx` - Uses `apiService.file.uploadFiles()`

### Hooks
- ✅ `useAuth.ts` - Uses `apiService.auth.getUserProfile()`

### Utils
- ✅ `upload.ts` - Wraps `apiService.file.uploadScreenshot()`

## Benefits

1. **Single Source of Truth** - All API endpoints defined in one place
2. **Consistent Error Handling** - Centralized error management
3. **Reusability** - No duplicate code across components
4. **Maintainability** - Easy to update API logic globally
5. **Type Safety** - Full TypeScript support with proper types
6. **Authentication** - Automatic token management from localStorage
7. **Progress Tracking** - Built-in upload progress callbacks

## Helper Functions

The service includes internal helper functions:
- `getAuthToken()` - Retrieves and validates auth token
- `getAuthHeaders()` - Returns Authorization headers

These are used internally and ensure consistent authentication across all API calls.
