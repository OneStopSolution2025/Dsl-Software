import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Register } from '@/pages/Register';
import { Login } from '@/pages/Login';
import { Home } from '@/pages/Home';
import { RichEditorPOC } from '@/pages/RichEditorPOC';
// import MapEditor from '@/pages/MapEditor'; // Import the new MapEditor page
// import TransformPOC from '@/pages/TransformPOC'; // Import Transform POC page

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<StaticPageRedirect/>} />

        {/* Protected Routes */}
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        {/* <Route
          path="/map-editor"
          element={
            <ProtectedRoute>
              <MapEditor />
            </ProtectedRoute>
          }
        /> */}

        {/* POC: Transform Controls */}
        {/* <Route
          path="/transform-poc"
          element={
            <ProtectedRoute>
              <TransformPOC />
            </ProtectedRoute>
          }
        /> */}

        {/* POC: Rich Text Editor */}
        <Route
          path="/rich-editor-poc"
          element={
            <ProtectedRoute>
              <RichEditorPOC />
            </ProtectedRoute>
          }
        />


        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

function StaticPageRedirect() {
  return (
    <iframe
      title="Landing Page"
      src="/landing/index.html"
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}