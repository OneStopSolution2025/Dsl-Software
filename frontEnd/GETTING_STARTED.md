# Getting Started

## ✅ Setup Complete!

Your Insurance Claims application has been successfully set up with all dependencies and components.

## 🚀 Quick Start

### 1. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_APP_NAME=Insurance Claims
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_FILES=50
```

**Important:** You need a Google Maps API key for the Road Map feature (Step 5).
Get one here: https://developers.google.com/maps/documentation/javascript/get-api-key

### 2. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 📋 Application Flow

1. **Register** - Create a new account at `/register`
2. **Login** - Sign in at `/login`
3. **Home** - Access the 6-step workflow at `/`

### 6-Step Workflow

1. **Upload Documents** - Drag & drop or select files
2. **OCR Extraction** - Files uploaded in batches of 5
3. **AutoFill** - Backend processes documents (auto-navigates)
4. **Preview** - Review generated DOCX document
5. **Road Map** - Mark incident locations on Google Maps
6. **Download** - Download final processed document

## 🔧 Backend API Requirements

Your backend should implement these endpoints:

### Authentication
```
POST /register
  Body: { username, email, password }
  Response: { message, userId }

POST /token
  Body: { username, password }
  Response: { token, user: { id, username, email } }
```

### File Processing
```
POST /upload-files
  Headers: Authorization: Bearer <token>
  Body: FormData (max 5 files)
  Response: { message, session_id, user_name, uploaded_files: [] }

POST /document/process/{session_id}
  Headers: Authorization: Bearer <token>
  Body: { session_id, template_filename }
  Response: { message, report_docx_gcs_uri, status }

GET /list/{session_id}
  Headers: Authorization: Bearer <token>
  Params: { session_id }
  Response: { message, url }
```

**Important**: All file processing endpoints require Bearer token authentication. The token is automatically included in all requests via the axios interceptor.

## 🎨 Features Implemented

### ✅ Authentication
- Register with validation
- Login with JWT token
- Token persistence
- Protected routes
- Auto-redirect on session expiry

### ✅ File Upload
- Drag & drop interface
- Multi-file support
- File validation (type, size)
- Batch upload (5 at a time)
- Progress tracking

### ✅ Document Processing
- OCR extraction
- Auto-fill processing
- DOCX preview
- Download functionality

### ✅ Map Integration
- Google Maps
- Location access
- Normal/Satellite view
- Draggable markers (car, bike, blast, trespasser)
- Screenshot & download map scene

### ✅ UI/UX
- Glassmorphism design
- Smooth animations
- Toast notifications
- Loading states
- Error handling
- Responsive layout

## 📁 Project Structure

```
src/
├── assets/          # Icons, images, lottie files
├── components/
│   ├── common/      # Reusable components
│   ├── layout/      # Layout components
│   ├── auth/        # Auth forms
│   └── steps/       # 6 step components
├── pages/           # Page components
├── store/           # Redux store & slices
├── hooks/           # Custom hooks
├── utils/           # Utilities & helpers
├── types/           # TypeScript types
└── routes/          # Route configuration
```

## 🐛 Troubleshooting

### Google Maps not loading
- Ensure `VITE_GOOGLE_MAPS_API_KEY` is set in `.env`
- Enable "Maps JavaScript API" in Google Cloud Console
- Check browser console for errors

### File upload fails
- Check backend CORS settings
- Verify file size limits
- Ensure backend is running

### Token not persisting
- Check browser localStorage
- Verify token is returned from `/token` endpoint
- Check for browser privacy settings blocking localStorage

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

## 📚 Tech Stack

- **React 18.3** - UI library
- **TypeScript 5.x** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Router** - Routing
- **React Hook Form + Zod** - Form validation
- **Axios** - HTTP client
- **Google Maps API** - Map integration
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

## 🎯 Next Steps

1. Configure your backend API
2. Add Google Maps API key
3. Test the complete workflow
4. Customize colors/branding if needed
5. Add additional features as required

## 📞 Support

Refer to the documentation files:
- `PROJECT_PLAN.md` - Complete project plan
- `TECHNICAL_ARCHITECTURE.md` - System architecture
- `DESIGN_SYSTEM.md` - Design guidelines
- `IMPLEMENTATION_GUIDE.md` - Implementation details

---

**Happy Coding! 🚀**
