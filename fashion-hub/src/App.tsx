import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import OnboardingPage from './pages/Onboarding';
import ProfessionalsPage from './pages/Professionals';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute requireApproved={false}>
                  <OnboardingPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/professionals" element={<ProfessionalsPage />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
