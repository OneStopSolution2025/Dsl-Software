# Insurance Claims Application

> A modern, corporate-style insurance claiming web application with a 6-step document processing workflow.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?logo=tailwindcss)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764abc?logo=redux)

---

## 📋 Overview

This application provides a streamlined workflow for insurance claim processing with document upload, OCR extraction, auto-filling, preview, incident mapping, and final document download capabilities.

### Key Features

- 🔐 **Secure Authentication** - JWT-based login/register with Bearer token authorization
- 📁 **Multi-file Upload** - Drag & drop with validation (PDF, JPG, PNG, DOCX)
- 🤖 **OCR Processing** - Automated document extraction with batch upload (5 files at a time)
- 📝 **Rich Text Editor** - Custom HTML editor for document editing with formatting tools
- 📄 **Document Preview** - View generated DOCX documents
- 🗺️ **Interactive Map** - Google Maps with 30+ customizable markers and color picker
- 🎨 **Color Customization** - Change marker colors with preset or custom color picker
- 💾 **Download** - Final processed documents with map screenshots
- 🎨 **Modern UI** - Glassmorphism design with smooth animations

---

## 🛠 Tech Stack

### Core
- **React 18.3+** with **TypeScript 5.x**
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 3.x** - Utility-first styling

### State Management
- **Redux Toolkit** - Global state management
- **RTK Query** - API caching

### Form & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### UI & Animation
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Lottie React** - Lottie animations

### File & Map
- **React Dropzone** - File uploads
- **@react-google-maps/api** - Google Maps integration
- **html2canvas** - Screenshot capture

### Document Editing
- **Quill** - Rich text editing
- **Custom HTML Editor** - Built-in HTML/text editor with formatting toolbar

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Maps API key
- Backend API running

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_APP_NAME=Insurance Claims
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_FILES=50
```

---

## 🎯 Application Workflow

### Authentication Flow
```
Register → Login → Store JWT Token → Protected Routes
```

### 6-Step Claim Workflow
1. **Upload Documents** - Drag & drop multiple files (PDF, JPG, PNG, DOCX)
2. **OCR Extraction** - Batch upload to server (5 files at a time) with progress tracking
3. **AutoFill** - Backend processes documents (auto-navigates on success)
4. **Preview** - View generated DOCX document with edit option
5. **Road Map** - Mark incident locations with customizable markers and colors
6. **Download** - Download final processed document

---

## 🗺️ Map Features

### Icon System (30+ Icons)
- **Vehicles**: Car, Bike, Pickup Truck, Lorry, Van, Bus
- **Pedestrians**: Man, Woman, Child
- **Direction**: Straight Arrow, Turn Arrow, Impact Blast
- **Environment**: Tree, Grass Verge, Drain
- **Traffic**: Traffic Light, CCTV, Pedestrian Crossing, Yellow Box, No Entry, One Way
- **Buildings**: School, Shops, Factory, Bus Stop, Office Building

### Marker Customization
- **12 Preset Colors**: Quick selection (Black, Blue, Red, Green, etc.)
- **Custom Color Picker**: Choose any color
- **Transform Controls**: Rotate, scale, flip markers
- **Drag & Drop**: Place markers on map
- **Visual Indicators**: Color dots in marker list

---

## 📝 Rich Text Editor

### Features
- Built-in custom HTML editor with toolbar
- Text formatting (bold, italic, underline, strikethrough)
- Headers (H1, H2, H3)
- Lists (ordered, bullet)
- Blockquotes and code blocks
- Text alignment
- Color and background color
- Links, images, tables
- Save edited content back to server

---

## 📁 Project Structure

```
frontEnd/
├── src/
│   ├── components/
│   │   ├── auth/           # Login/Register forms
│   │   ├── common/         # Reusable components (Button, Input, etc.)
│   │   ├── editor/         # Rich text editors
│   │   ├── layout/         # Headers, layouts
│   │   ├── map/            # Map components and markers
│   │   └── steps/          # 6-step workflow components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── routes/             # Route configuration
│   ├── services/           # API service layer
│   ├── store/              # Redux store and slices
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions and constants
├── public/                 # Static assets
├── .env                    # Environment variables
└── package.json
```

---

## 🔐 Authentication & API

### JWT Token Authentication
All protected endpoints require Bearer token:
- Token obtained from `/token` endpoint on login
- Stored in localStorage (`auth_token`)
- Automatically added to requests via axios interceptor
- Auto-logout on 401 (session expired)

### API Endpoints

```typescript
// Authentication
POST /register          // Register new user
POST /token             // Login and get JWT token

// File Processing (Bearer token required)
POST /upload-files      // Upload files (max 5 per batch)
POST /document/process/{session_id}  // Process documents
GET /list/{session_id}  // Get final document URL
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue spectrum (#3b82f6)
- **Accents**: Cyan, Purple, Amber, Red, Green
- **Glass Effects**: Semi-transparent with backdrop blur
- **Neutrals**: Gray scale for text and backgrounds

### Glassmorphism Style
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Nginx Server**
   - Copy `dist/` folder to server
   - Configure nginx with SSL
   - See DEVELOPER_GUIDE.md for details

---

## 🐛 Troubleshooting

### Google Maps not loading
- Verify `VITE_GOOGLE_MAPS_API_KEY` in `.env`
- Enable "Maps JavaScript API" in Google Cloud Console

### File upload fails
- Check backend CORS settings
- Verify file size limits (default: 10MB)
- Ensure backend is running

### Token not persisting
- Check browser localStorage for `auth_token`
- Verify token is returned from `/token` endpoint

---

## 📞 Support

For detailed development documentation, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

---

## 📄 License

© 2025 Insurance Claims Application. All rights reserved.
- Step validation

---

## 🔧 Step Details

### Step 1: Upload Documents
- Drag & drop zone
- Multi-file support
- File validation (type, size)
- File cards with remove option
- Upload CTA

### Step 2: OCR Extraction
- Batch upload (5 files at a time)
- Loading animation per file
- Success/error status
- Error handling with retry
- Next CTA on success

### Step 3: AutoFill
- Lottie loading animation
- Auto-triggered API call
- Auto-navigate on success
- Error handling with back option

### Step 4: Preview
- DOCX document viewer
- Read-only mode
- Scroll through pages
- Confirm CTA

### Step 5: Road Map
- Google Maps integration
- Location access
- Normal/Satellite view toggle
- Draggable SVG markers (car, bike, blast, trespasser)
- Marker position tracking (lat/lng)
- Clear markers functionality
- Download scene as image
- Next CTA when markers added

### Step 6: Download
- Download final DOCX
- API call to get file URL
- Success feedback

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login with credentials
- [ ] Token persistence
- [ ] Upload files
- [ ] File validation
- [ ] Batch upload
- [ ] Step navigation
- [ ] Map markers
- [ ] Download document
- [ ] Logout

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚀 Build & Deploy

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

---

## 📊 Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)
- **Lighthouse Score**: 90+

---

## 🐛 Known Issues

None at this time. Please report issues via GitHub Issues.

---

## 🔮 Future Enhancements

- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)
- [ ] Email verification
- [ ] Password reset flow
- [ ] File preview before upload
- [ ] Drag to reorder files
- [ ] Save draft functionality
- [ ] Export map as PDF
- [ ] Mobile app (React Native)
- [ ] PWA support

---

## 📄 API Endpoints

### Authentication
```
POST /register
POST /token
```

### File Processing
```
POST /upload-files (max 5 files)
POST /document/process/{session_id}
GET  /list/{session_id}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is proprietary and confidential.

---

## 👥 Team

- **CTO/Lead Developer** - Architecture & Implementation
- **Backend Team** - API development
- **QA Team** - Testing & validation

---

## 📞 Support

For support, email support@insuranceclaims.com or open an issue.

---

## 🙏 Acknowledgments

- [React Team](https://react.dev) - Amazing framework
- [Tailwind Labs](https://tailwindcss.com) - Beautiful styling
- [Redux Team](https://redux-toolkit.js.org) - State management
- [Google Maps](https://developers.google.com/maps) - Map integration

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**
