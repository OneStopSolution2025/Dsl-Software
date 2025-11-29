import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Register } from '@/pages/Register';
import { Login } from '@/pages/Login';
import { Home } from '@/pages/Home';
// import MapEditor from '@/pages/MapEditor'; // Import the new MapEditor page
// import TransformPOC from '@/pages/TransformPOC'; // Import Transform POC page

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
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


        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
