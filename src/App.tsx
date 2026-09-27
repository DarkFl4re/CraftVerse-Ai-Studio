import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { ConfirmModal } from './components/common/ConfirmModal';
import { PhotoLightbox } from './components/common/PhotoLightbox';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PostViewPage } from './pages/PostViewPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SubmitMapPage } from './pages/SubmitMapPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AuthPage } from './pages/AuthPage';
import { OwnerPanelPage } from './pages/OwnerPanelPage';
import { StaticPage } from './pages/StaticPage';

const AppContent: React.FC = () => {
  const { screen } = useApp();

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      case 'post':
        return <PostViewPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'submit':
        return <SubmitMapPage />;
      case 'account':
      case 'profile':
        return <ProfilePage />;
      case 'editAccount':
      case 'editName':
      case 'editUsername':
      case 'editBio':
      case 'editGender':
      case 'editDob':
        return <EditProfilePage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'auth':
        return <AuthPage />;
      case 'ownerPanel':
        return <OwnerPanelPage />;
      case 'about':
        return <StaticPage type="about" />;
      case 'terms':
        return <StaticPage type="terms" />;
      case 'dmca':
        return <StaticPage type="dmca" />;
      default:
        return <HomePage />;
    }
  };

  const showFooter =
    screen === 'home' ||
    screen === 'favorites' ||
    screen === 'explore' ||
    screen === 'about' ||
    screen === 'terms' ||
    screen === 'dmca';

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F3F5F9] flex flex-col font-sans selection:bg-[#3E8EFF]/25 selection:text-[#3E8EFF]">
      <Header />
      <main className="flex-1 w-full">{renderScreen()}</main>
      {showFooter && <Footer />}
      <BottomNav />
      <Toast />
      <ConfirmModal />
      <PhotoLightbox />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
