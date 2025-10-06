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

- 🔐 **Secure Authentication** - JWT-based login/register system
- 📁 **Multi-file Upload** - Drag & drop with validation
- 🤖 **OCR Processing** - Automated document extraction
- 📄 **Document Preview** - Read-only DOCX viewer
- 🗺️ **Interactive Map** - Google Maps with draggable incident markers
- 💾 **Download** - Final processed documents
- 🎨 **Modern UI** - Glassmorphism design with smooth animations

---

## 🛠 Tech Stack

### Core
- **React 18.3+** with **TypeScript 5.x**
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 3.x** - Utility-first styling

### State Management
- **Redux Toolkit** - Global state
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
- **@react-google-maps/api** - Google Maps
- **html2canvas** - Screenshot capture

---

## 📁 Project Structure

```
src/
├── assets/              # Static assets (icons, images, lottie)
├── components/
│   ├── common/          # Reusable components (Button, Input, etc.)
│   ├── layout/          # Layout components (Header, AuthLayout)
│   ├── auth/            # Auth forms (Login, Register)
│   └── steps/           # Step components (Upload, OCR, etc.)
├── pages/               # Page components (Register, Login, Home)
├── store/               # Redux store, slices, API
├── hooks/               # Custom hooks
├── utils/               # Utilities (validation, helpers, constants)
├── types/               # TypeScript type definitions
├── routes/              # Route configuration
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Maps API key
- Backend API running

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Dsl-Software

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_APP_NAME=Insurance Claims
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_FILES=50
```

---

## 📖 Documentation

- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** - Complete project plan, requirements, and timeline
- **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)** - System architecture and data flow
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Color palette, typography, and component styles
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step implementation instructions

---

## 🎯 Application Flow

### Authentication
```
Register → Success Toast → Login → Store Token → Home
```

### 6-Step Workflow
```
1. Upload Documents → User uploads files
2. OCR Extraction → Batch upload to server (5 at a time)
3. AutoFill → Backend processing (auto-navigate on success)
4. Preview → View generated DOCX
5. Road Map → Mark incident locations on map
6. Download → Download final document
```

---

## 🎨 Design Highlights

### Glassmorphism UI
- Frosted glass effect with backdrop blur
- Semi-transparent backgrounds
- Subtle borders and shadows
- Modern corporate aesthetic

### Color Palette
- **Primary**: Blue spectrum (#3b82f6)
- **Accents**: Cyan, Purple, Amber, Red, Green
- **Glass**: White/Black with opacity
- **Neutral**: Gray scale for text

### Animations
- Smooth page transitions (300-500ms)
- Step indicator progress
- Micro-interactions on hover
- Lottie animations for processing states

---

## 🔐 Security Features

- JWT token authentication
- Token stored in localStorage
- API request interceptors
- Protected routes
- 401 auto-redirect to login
- Form validation (client-side)
- File type & size validation

---

## 📱 Pages

### 1. Register Page
- Username, email, password fields
- Real-time validation
- Success toast on registration
- Auto-navigate to login

### 2. Login Page
- Username, password fields
- Token storage on success
- Navigate to home
- Token persistence check

### 3. Home Page
**Header**
- App logo and name
- User menu with logout (if authenticated)
- Login/Register CTAs (if not authenticated)

**Stepper Workflow**
- Visual step indicator (1-6)
- Dynamic step content
- Back/Next navigation
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
