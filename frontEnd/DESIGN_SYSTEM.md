# Design System - Insurance Claims Application

## 🎨 Color Palette

### Primary Colors (Blue Spectrum)
```css
/* Light to Dark */
--primary-50: #eff6ff;   /* Backgrounds, hover states */
--primary-100: #dbeafe;  /* Light backgrounds */
--primary-200: #bfdbfe;  /* Borders, dividers */
--primary-300: #93c5fd;  /* Disabled states */
--primary-400: #60a5fa;  /* Hover states */
--primary-500: #3b82f6;  /* PRIMARY BRAND COLOR - Buttons, links */
--primary-600: #2563eb;  /* Active states */
--primary-700: #1d4ed8;  /* Pressed states */
--primary-800: #1e40af;  /* Dark mode primary */
--primary-900: #1e3a8a;  /* Text on light backgrounds */
```

### Accent Colors
```css
--accent-cyan: #06b6d4;     /* Success, completed steps */
--accent-purple: #8b5cf6;   /* Interactive elements, focus */
--accent-amber: #f59e0b;    /* Warnings, pending states */
--accent-red: #ef4444;      /* Errors, delete actions */
--accent-green: #10b981;    /* Success messages, confirmations */
--accent-indigo: #6366f1;   /* Secondary actions */
```

### Glassmorphism Colors
```css
/* Glass effects - use with backdrop-filter */
--glass-white-10: rgba(255, 255, 255, 0.1);
--glass-white-15: rgba(255, 255, 255, 0.15);
--glass-white-20: rgba(255, 255, 255, 0.2);
--glass-white-25: rgba(255, 255, 255, 0.25);
--glass-white-30: rgba(255, 255, 255, 0.3);

--glass-dark-10: rgba(0, 0, 0, 0.1);
--glass-dark-20: rgba(0, 0, 0, 0.2);
--glass-dark-30: rgba(0, 0, 0, 0.3);

--glass-border: rgba(255, 255, 255, 0.18);
--glass-border-strong: rgba(255, 255, 255, 0.3);
```

### Neutral Colors
```css
--neutral-50: #f8fafc;   /* Page backgrounds */
--neutral-100: #f1f5f9;  /* Card backgrounds */
--neutral-200: #e2e8f0;  /* Borders */
--neutral-300: #cbd5e1;  /* Dividers */
--neutral-400: #94a3b8;  /* Placeholder text */
--neutral-500: #64748b;  /* Secondary text */
--neutral-600: #475569;  /* Body text */
--neutral-700: #334155;  /* Headings */
--neutral-800: #1e293b;  /* Dark headings */
--neutral-900: #0f172a;  /* Primary text */
```

### Semantic Colors
```css
--success-light: #d1fae5;
--success: #10b981;
--success-dark: #059669;

--error-light: #fee2e2;
--error: #ef4444;
--error-dark: #dc2626;

--warning-light: #fef3c7;
--warning: #f59e0b;
--warning-dark: #d97706;

--info-light: #dbeafe;
--info: #3b82f6;
--info-dark: #2563eb;
```

---

## 🖼 Background Gradients

### Page Backgrounds
```css
/* Main gradient for auth pages */
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Alternative gradient */
.bg-gradient-blue {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
}

/* Subtle gradient for home page */
.bg-gradient-subtle {
  background: linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%);
}

/* Animated gradient */
.bg-gradient-animated {
  background: linear-gradient(
    -45deg,
    #667eea,
    #764ba2,
    #f093fb,
    #4facfe
  );
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

## 🪟 Glassmorphism Components

### Glass Card (Standard)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

/* Tailwind classes */
.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl;
}
```

### Glass Card (Strong)
```css
.glass-card-strong {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px) saturate(200%);
  -webkit-backdrop-filter: blur(16px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
}
```

### Glass Button
```css
.glass-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
```

### Glass Input
```css
.glass-input {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #1e293b;
}

.glass-input::placeholder {
  color: rgba(30, 41, 59, 0.5);
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.3);
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

---

## 📝 Typography

### Font Families
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

### Typography Scale
```css
/* Heading 1 */
.h1 {
  font-size: 3rem;        /* 48px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* Heading 2 */
.h2 {
  font-size: 2.25rem;     /* 36px */
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

/* Heading 3 */
.h3 {
  font-size: 1.875rem;    /* 30px */
  font-weight: 600;
  line-height: 1.4;
}

/* Heading 4 */
.h4 {
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;
  line-height: 1.5;
}

/* Body Large */
.body-lg {
  font-size: 1.125rem;    /* 18px */
  font-weight: 400;
  line-height: 1.75;
}

/* Body */
.body {
  font-size: 1rem;        /* 16px */
  font-weight: 400;
  line-height: 1.5;
}

/* Body Small */
.body-sm {
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;
  line-height: 1.5;
}

/* Caption */
.caption {
  font-size: 0.75rem;     /* 12px */
  font-weight: 400;
  line-height: 1.5;
  color: var(--neutral-500);
}
```

---

## 🔘 Button Styles

### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### Secondary Button (Glass)
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: #1e293b;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}
```

### Outline Button
```css
.btn-outline {
  background: transparent;
  color: #3b82f6;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #3b82f6;
  color: white;
}
```

### Button Sizes
```css
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  height: 36px;
}

.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  height: 44px;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  height: 52px;
}
```

---

## 📥 Input Styles

### Text Input
```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid var(--neutral-300);
  background: white;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input.error {
  border-color: #ef4444;
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

### Glass Input (for auth pages)
```css
.input-glass {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #1e293b;
  transition: all 0.2s ease;
}

.input-glass::placeholder {
  color: rgba(30, 41, 59, 0.5);
}

.input-glass:focus {
  background: rgba(255, 255, 255, 0.3);
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

---

## 🎯 Component Patterns

### Card
```css
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
```

### File Card
```css
.file-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.file-card:hover {
  background: rgba(255, 255, 255, 0.25);
}
```

### Step Indicator
```css
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
}

.step-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step-dot.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.step-dot.completed {
  background: #10b981;
  color: white;
}

.step-dot.pending {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid var(--neutral-300);
  color: var(--neutral-500);
}

.step-line {
  flex: 1;
  height: 2px;
  background: var(--neutral-300);
  margin: 0 0.5rem;
}

.step-line.completed {
  background: #10b981;
}
```

### Toast Notification
```css
.toast {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  font-weight: 500;
}

.toast.success {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.toast.error {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.toast.warning {
  background: rgba(245, 158, 11, 0.9);
  color: white;
}

.toast.info {
  background: rgba(59, 130, 246, 0.9);
  color: white;
}
```

---

## 🎭 Animations

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.4s ease-out;
}
```

### Slide In (Left/Right)
```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-left {
  animation: slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-in-right {
  animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 0.3s ease-out;
}
```

### Pulse
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Spin
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}
```

---

## 📐 Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## 🔲 Border Radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-full: 9999px;
```

---

## 🌑 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Glass shadows */
--shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
--shadow-glass-strong: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
```

---

## 🎨 Usage Examples

### Auth Page Layout
```jsx
<div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
  <div className="glass-card w-full max-w-md p-8 space-y-6">
    <h2 className="h2 text-white text-center">Welcome Back</h2>
    <form className="space-y-4">
      <input 
        type="text" 
        placeholder="Username"
        className="input-glass"
      />
      <button className="btn-primary w-full">
        Sign In
      </button>
    </form>
  </div>
</div>
```

### Step Container
```jsx
<div className="bg-gradient-subtle min-h-screen">
  <div className="container mx-auto px-4 py-8">
    <div className="glass-card-strong p-8 space-y-6">
      <h3 className="h3 text-neutral-900">Upload Documents</h3>
      {/* Content */}
    </div>
  </div>
</div>
```

---

## 🎯 Accessibility

### Focus States
```css
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text)
- Interactive elements have clear hover/focus states
- Error states use both color and icons

---

*This design system ensures consistency across the entire application.*
