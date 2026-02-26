import React, { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import LoginButton from './components/LoginButton';
import ProfileSetupModal from './components/ProfileSetupModal';
import ApprovalRequestScreen from './components/ApprovalRequestScreen';
import HomePage from './pages/HomePage';
import SessionsPage from './pages/SessionsPage';
import WalletPage from './pages/WalletPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerApproved, useIsCallerAdmin } from './hooks/useQueries';
import { GraduationCap, Loader2 } from 'lucide-react';

function AppContent() {
  const [currentPath, setCurrentPath] = useState('/');
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();
  const { data: isAdmin } = useIsCallerAdmin();

  const navigate = (path: string) => setCurrentPath(path);

  // Show loading spinner while initializing auth
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Pristine Learning...</p>
        </div>
      </div>
    );
  }

  // Not logged in — show landing/login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl overflow-hidden bg-primary/10 flex items-center justify-center shadow-card">
              <img
                src="/assets/generated/pristine-logo.dim_256x256.png"
                alt="Pristine Learning"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
              Pristine Learning
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your portable teaching business ecosystem. Manage sessions, track earnings, and grow your online teaching career.
            </p>
          </div>
          <div className="space-y-3">
            <LoginButton />
            <p className="text-xs text-muted-foreground">
              Secure login powered by Internet Identity
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: 'Sessions', value: '1:1 & Group' },
              { label: 'AI Tools', value: '6 Tools' },
              { label: 'Analytics', value: 'Real-time' },
            ].map((item) => (
              <div key={item.label} className="bg-card rounded-xl p-3 border border-border shadow-xs">
                <p className="text-xs font-semibold text-primary">{item.value}</p>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Loading profile after login
  if (profileLoading && !profileFetched) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // New user — needs to set up profile
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetupModal open={true} />;
  }

  // Waiting for approval check
  if (approvalLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // Not approved — show approval request screen
  if (!isApproved && !isAdmin) {
    return (
      <ApprovalRequestScreen userName={userProfile?.name || 'Teacher'} />
    );
  }

  // Render the current page
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/sessions':
        return <SessionsPage />;
      case '/wallet':
        return <WalletPage />;
      case '/ai-assistant':
        return <AIAssistantPage />;
      case '/analytics':
        return <AnalyticsPage />;
      case '/profile':
        return <ProfilePage />;
      case '/admin':
        return <AdminPanelPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <Layout currentPath={currentPath} onNavigate={navigate}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppContent />
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
