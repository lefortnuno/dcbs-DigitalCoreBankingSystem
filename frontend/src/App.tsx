import { Routes, Route, Navigate } from "react-router-dom";
import { ProfilePage } from "./pages/ProfilePage";
import { LoadingModelPage } from "./pages/LoadingModelPage";
import { AuthWrapper } from "./hooks/AuthWrapper";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          <AuthWrapper requireAuth={false}>
            <LoadingModelPage />
          </AuthWrapper>
        }
      />

      {/* Protected */}
      <Route
        path="/profile"
        element={
          <AuthWrapper requireAuth={true}>
            {user ? <ProfilePage /> : <LoadingModelPage />}
          </AuthWrapper>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}