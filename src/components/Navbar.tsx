
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Plus, Calendar, Menu, X, LogIn, UserPlus, LogOut, User, Star } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border transition-all duration-300 ease-in-out shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center hover-scale">
              <Sparkles className="h-8 w-8 text-primary animate-float" />
              <span className="ml-2 text-xl font-semibold text-primary relative">
                T-List
                <span className="absolute -top-1 -right-3 text-xs text-amber-500 animate-pulse-slow">
                  <Star className="h-3 w-3 fill-amber-500" />
                </span>
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <button 
                  onClick={() => scrollToSection('tasks-section')}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors duration-200 focus-ring hover-lift"
                >
                  Tasks
                </button>
                <button 
                  onClick={() => scrollToSection('daily-section')}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors duration-200 focus-ring hover-lift"
                >
                  Daily
                </button>
                <button 
                  onClick={() => scrollToSection('calendar-section')}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors duration-200 focus-ring hover-lift"
                >
                  <Calendar className="mr-2 h-4 w-4 animate-bounce-slow" />
                  Calendar
                </button>
                <button 
                  onClick={() => scrollToSection('add-task-section')}
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus-ring hover-lift"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </button>
                <div className="ml-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors duration-200 focus-ring hover-lift">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus-ring hover-lift">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-primary hover:bg-secondary transition-colors duration-200 focus-ring"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out max-h-0 overflow-hidden",
          mobileMenuOpen && "max-h-60"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {isSignedIn ? (
            <>
              <button 
                onClick={() => scrollToSection('tasks-section')}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors duration-200"
              >
                Tasks
              </button>
              <button 
                onClick={() => scrollToSection('daily-section')}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors duration-200"
              >
                Daily
              </button>
              <button 
                onClick={() => scrollToSection('calendar-section')}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors duration-200"
              >
                <Calendar className="inline-block mr-2 h-4 w-4 animate-bounce-slow" />
                Calendar
              </button>
              <button 
                onClick={() => scrollToSection('add-task-section')}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors duration-200"
              >
                <Plus className="inline-block mr-2 h-4 w-4" />
                New Task
              </button>
              <div className="px-3 py-2">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  {user && (
                    <div className="ml-3">
                      <div className="text-base font-medium">{user.fullName || user.firstName}</div>
                      <div className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors duration-200">
                  <LogIn className="inline-block mr-2 h-4 w-4" />
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors duration-200">
                  <UserPlus className="inline-block mr-2 h-4 w-4" />
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
