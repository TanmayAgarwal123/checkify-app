
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { ClerkProvider } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import SplashScreen from '@/components/SplashScreen';

// Get your Clerk publishable key
const PUBLISHABLE_KEY = "pk_test_cG9wdWxhci1wYW50aGVyLTk3LmNsZXJrLmFjY291bnRzLmRldiQ";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMobileApp, setIsMobileApp] = useState(false);
  
  useEffect(() => {
    // Check if running as a Capacitor app
    const checkIfMobileApp = async () => {
      try {
        // Use window.Capacitor as a check
        if (window.Capacitor?.isNativePlatform()) {
          setIsMobileApp(true);
        }
      } catch (e) {
        console.log('Not running as a Capacitor app');
      }
    };
    
    checkIfMobileApp();
  }, []);
  
  // Only show splash screen in mobile app
  if (isMobileApp && showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }
  
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider defaultTheme="light" storageKey="tlist-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
