import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';
import { account } from "../lib/appwrite";

// Toast Message Component
const ToastMessage = ({ type = 'default', title, message, isVisible, onClose, duration = 5000 }) => {
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          onClose();
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isVisible, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-900/20 to-emerald-800/20',
          border: 'border-emerald-500/30',
          accent: 'bg-emerald-500',
          icon: CheckCircle,
          iconColor: 'text-emerald-400'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-900/20 to-red-800/20',
          border: 'border-red-500/30',
          accent: 'bg-red-500',
          icon: AlertCircle,
          iconColor: 'text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-900/20 to-amber-800/20',
          border: 'border-amber-500/30',
          accent: 'bg-amber-500',
          icon: AlertCircle,
          iconColor: 'text-amber-400'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-900/20 to-blue-800/20',
          border: 'border-blue-500/30',
          accent: 'bg-blue-500',
          icon: Info,
          iconColor: 'text-blue-400'
        };
      case 'loading':
        return {
          bg: 'bg-gradient-to-r from-slate-900/20 to-slate-800/20',
          border: 'border-slate-500/30',
          accent: 'bg-slate-500',
          icon: Loader2,
          iconColor: 'text-slate-400'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-900/20 to-gray-800/20',
          border: 'border-gray-500/30',
          accent: 'bg-gray-500',
          icon: Info,
          iconColor: 'text-gray-400'
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <div 
        className={`
          relative overflow-hidden rounded-xl backdrop-blur-xl
          ${styles.bg} ${styles.border}
          border shadow-2xl transform transition-all duration-500 ease-out
          hover:scale-[1.02] hover:shadow-3xl
        `}
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px) saturate(150%)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-0.5 bg-white/10 w-full">
          <div 
            className={`h-full ${styles.accent} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <div className={`flex-shrink-0 ${styles.iconColor} mt-0.5`}>
            <IconComponent 
              size={20} 
              className={type === 'loading' ? 'animate-spin' : ''}
            />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm leading-tight mb-1">
              {title}
            </h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-md hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Subtle Glow Effect */}
        <div 
          className={`absolute inset-0 opacity-5 ${styles.accent} pointer-events-none`}
          style={{
            background: `radial-gradient(circle at 20% 20%, currentColor 0%, transparent 70%)`
          }}
        />
      </div>
    </div>
  );
};

// Main Home Component
const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast functions
  const showToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message, isVisible: true }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleGoogleLogin = async () => {
    try {
      showToast('loading', 'Connecting to SantPrem', 'Establishing connection with your spiritual journey...');
      
      await account.createOAuth2Session(
        "google",
        "https://sant-prem.vercel.app/?loggedIn=true",
        "https://sant-prem.vercel.app/"
      );
      
      // Note: The redirect will happen automatically, so success toast will be shown in useEffect
    } catch (error) {
      console.error("OAuth login failed:", error);
      
      // Remove loading toast
      setToasts(prev => prev.filter(toast => toast.type !== 'loading'));
      
      // Show error toast
      showToast('error', 'Connection Failed', 'Unable to establish divine connection. Please try again with pure intentions.');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await account.get();
        setUser(res);

        const url = new URL(window.location.href);
        if (url.searchParams.get("loggedIn") === "true") {
          url.searchParams.delete("loggedIn");
          window.history.replaceState({}, document.title, url.pathname);
          
          // Show welcome toast when redirected after login
          showToast('success', 'Successfully Logged In', `Welcome back to your spiritual journey, ${res?.name?.split(" ")[0] || "Seeker"} Ji!`);
        }
      } catch (err) {
        setUser(null);
        // Only show session expired message if there was actually a session
        if (err.code !== 401) {
          showToast('warning', 'Session Expired', 'Your spiritual session has expired. Please sign in again to continue your journey.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const displayName = user?.name?.split(" ")[0] || "Seeker";

  // Demo function to test different toast types
  const showDemoToast = (type) => {
    const messages = {
      success: { title: 'Spiritual Milestone Achieved', message: 'You have successfully completed today\'s meditation practice.' },
      error: { title: 'Divine Connection Lost', message: 'Unable to sync with your spiritual progress. Please check your connection.' },
      warning: { title: 'Energy Levels Low', message: 'Your spiritual energy is running low. Consider taking a mindful break.' },
      info: { title: 'New Wisdom Available', message: 'Fresh spiritual insights have been added to your growth journey.' },
    };
    
    showToast(type, messages[type].title, messages[type].message);
  };

  return (
    <div className="h-screen w-full bg-black text-white relative overflow-hidden">
      {/* Blurred Backgrounds */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-yellow-500 opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-500 opacity-20 rounded-full blur-3xl" />
      <div className="absolute top-[30%] left-[40%] w-[250px] h-[250px] bg-purple-500 opacity-10 rounded-full blur-2xl" />



      {/* Main Content */}
      <div className="flex items-center justify-center h-full px-6 text-center relative z-10">
        <div className="space-y-8 max-w-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fadeIn">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
                <div className="absolute inset-3 rounded-full bg-yellow-400/20" />
              </div>
              <p className="text-yellow-400 text-lg font-medium animate-pulse">
                Loading your divine journey...
              </p>
            </div>
          ) : user ? (
            <>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                Welcome, <span className="text-yellow-500">{displayName} Ji</span>!
              </h1>

              <figure className="pt-6 mt-8 border-t border-gray-800 text-center space-y-4">
                <blockquote className="text-xl text-gray-300 italic font-light leading-relaxed relative before:content-[''] before:text-4xl before:text-yellow-500 before:align-top before:mr-1 after:content-[''] after:text-4xl after:text-yellow-500 after:align-bottom after:ml-1">
                  The <span className="bg-blue-400/30 px-1 text-white">silence of the heart</span> speaks louder than the noise of the world.
                </blockquote>
                <figcaption className="text-sm text-yellow-500 font-medium tracking-wide text-right pr-4">
                  — Sant Prem
                </figcaption>
              </figure>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                Discover the empowering guidance{" "}
                <span className="text-yellow-500">Sant Prem</span> brings to your life
              </h1>
              <p className="text-gray-400 text-base">Let's start by signing in.</p>

              <button
                onClick={handleGoogleLogin}
                className="mt-6 w-full max-w-md mx-auto bg-black border border-yellow-600 text-white px-6 py-4 rounded-xl flex items-center gap-4 justify-center text-lg font-medium shadow-md hover:shadow-yellow-500/30 transition duration-300 hover:border-yellow-400 hover:cursor-pointer"
              >
                <FcGoogle size={28} />
                Continue With Google
              </button>
            </>
          )}

          {/* Footer */}
          <div className="absolute bottom-4 left-0 w-full text-center text-neutral-400 text-xs z-10">
            Inspired by Premanand Ji Maharaj ❤️
          </div>
        </div>
      </div>

      {/* Toast Container */}
      {toasts.map(toast => (
        <ToastMessage
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Home;