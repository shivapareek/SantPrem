import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';

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
   <div className="fixed top-4 right-4 z-[9999] w-96 pointer-events-auto">

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

// Demo Component
const ToastDemo = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message, isVisible: true }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toastExamples = [
    { 
      type: 'success', 
      title: 'Spiritual Journey Activated', 
      message: 'Your meditation practice has been successfully synchronized with your soul\'s journey.' 
    },
    { 
      type: 'error', 
      title: 'Connection Interrupted', 
      message: 'Unable to establish connection with the divine servers. Please check your spiritual alignment.' 
    },
    { 
      type: 'warning', 
      title: 'Energy Levels Low', 
      message: 'Your spiritual energy is running low. Consider taking a mindful break for restoration.' 
    },
    { 
      type: 'info', 
      title: 'New Wisdom Available', 
      message: 'Fresh spiritual insights have been added to your personal growth library.' 
    },
    { 
      type: 'loading', 
      title: 'Processing Sacred Request', 
      message: 'Your spiritual transformation is being carefully prepared with divine attention.' 
    }
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Professional Toast Messages
        </h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {toastExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => showToast(example.type, example.title, example.message)}
              className="p-4 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-700 text-left transition-colors duration-200"
            >
              <h3 className="text-white font-medium mb-2 capitalize">
                {example.type} Toast
              </h3>
              <p className="text-gray-400 text-sm">
                {example.title}
              </p>
            </button>
          ))}
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
    </div>
  );
};

export default ToastDemo;