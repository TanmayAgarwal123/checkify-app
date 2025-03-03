
import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(onFinished, 500); // Wait for fade out animation
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onFinished]);
  
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
      style={{ 
        opacity, 
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <Sparkles className="h-20 w-20 text-primary animate-float" />
      <h1 className="mt-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
        T-List
      </h1>
      <div className="mt-8 w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-pulse-slow" />
      </div>
    </div>
  );
};

export default SplashScreen;
