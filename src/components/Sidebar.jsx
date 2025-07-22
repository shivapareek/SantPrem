import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  TvMinimalPlay,
  Flower,
  Home,
  Music,
  NotepadText,
  Menu,
  X,
  Lock,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
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

const navItems = [
  { name: "Home", icon: <Home size={20} />, path: "/" },
  { name: "Bhajan", icon: <Music size={20} />, path: "/bhajan" },
  { name: "Sant Vaani", icon: <TvMinimalPlay size={20} />, path: "/vaani" },
  { name: "Man Ki Baat", icon: <NotepadText  size={20} />, path: "/diary" },
  { name: "Radha Jaap", icon: <Flower size={20} />, path: "/meditation" },
  { name: "SantPrem AI", icon: <Sun size={20} />, path: "/chatbot" },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
  const toggleDesktopSidebar = () => setDesktopCollapsed(!desktopCollapsed);
  
  const navigate = useNavigate();

  // Toast functions
  const showToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message, isVisible: true }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    account
      .get()
      .then((res) => setUser(res))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      // Show loading toast
      showToast('loading', 'Signing Out', 'Ending your spiritual session...');
      
      await account.deleteSession("current");
      
      // Remove loading toast
      setToasts(prev => prev.filter(toast => toast.type !== 'loading'));
      
      // Show success toast
      showToast('success', 'Signed Out Successfully', 'Your spiritual session has ended peacefully. See you again soon!');
      
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      
      // Remove loading toast
      setToasts(prev => prev.filter(toast => toast.type !== 'loading'));
      
      // Show error toast
      showToast('error', 'Logout Failed', 'Unable to end your session properly. Please try again.');
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      {!mobileOpen && (
        <button
          className="fixed top-4 left-4 z-50 text-neutral-500 hover:text-yellow-300 hover:cursor-pointer p-2 rounded-md md:hidden"
          onClick={toggleMobileSidebar}
        >
          <Menu size={22} />
        </button>
      )}

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen overflow-y-auto bg-black text-white border-r border-neutral-800 py-8 z-50 transition-all duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0 w-64 px-6" : "-translate-x-full w-64 px-6"} 
        md:translate-x-0 md:static 
        ${desktopCollapsed ? "md:w-16 md:px-2" : "md:w-64 md:px-6"}`}
      >
        <div className="relative flex flex-col justify-between h-full">
          <div>
            {/* Logo + Desktop Toggle */}
           <div
  className={`mb-6 flex items-center justify-between ${
    mobileOpen ? "flex-row" : ""
  }`}
>
  {!desktopCollapsed && (
    <h1 className="text-xl font-semibold text-yellow-400">
      SantPrem
    </h1>
  )}

  {/* Mobile Close Button */}
  {mobileOpen && (
    <button
      className="text-neutral-400 p-1 rounded-md hover:text-yellow-300 hover:cursor-pointer md:hidden"
      onClick={toggleMobileSidebar}
    >
      <X size={22} />
    </button>
  )}

  {/* Desktop Collapse Toggle */}
<button
  className={`hidden md:flex items-center justify-center text-neutral-400 p-1 rounded-md hover:text-yellow-300 hover:cursor-pointer
    ${desktopCollapsed ? "w-full h-10" : ""}`}
  onClick={toggleDesktopSidebar}
  title="Toggle Sidebar"
>
  {desktopCollapsed ? <Menu size={20} /> : <X size={20} />}
</button>

</div>

            {/* Navigation */}
            <nav
              className={`space-y-5 mt-10 ${
                desktopCollapsed ? "md:space-y-3" : ""
              }`}
            >
              {navItems.map((item, idx) => (
                <div key={idx}>
                  {user ? (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                          isActive
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "text-neutral-400 hover:text-yellow-300 hover:bg-white/5"
                        } ${
                          desktopCollapsed ? "md:justify-center md:gap-0" : ""
                        }`
                      }
                      onClick={() => setMobileOpen(false)}
                      title={desktopCollapsed ? item.name : ""}
                    >
                      {item.icon}
                      <span
                        className={desktopCollapsed ? "md:hidden" : ""}
                      >
                        {item.name}
                      </span>
                    </NavLink>
                  ) : (
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-600 bg-white/5 cursor-not-allowed ${
                        desktopCollapsed ? "md:justify-center md:gap-0" : ""
                      }`}
                      title={desktopCollapsed ? item.name : ""}
                    >
                      <Lock size={16} />
                      <span
                        className={desktopCollapsed ? "md:hidden" : ""}
                      >
                        {item.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Footer */}
          {user && (
            <div className="border-t border-neutral-800 pt-4 space-y-2 mt-10 text-xs text-neutral-400">
              <div
                className={`flex items-center gap-2 ${
                  desktopCollapsed ? "md:justify-center" : ""
                }`}
              >
                <User size={18} />
                <span className={desktopCollapsed ? "md:hidden" : ""}>
                  {user.name}
                </span>
              </div>
              <div
                className={`flex items-center gap-2  ${
                  desktopCollapsed ? "md:justify-center" : ""
                }`}
              >
                <LogOut size={18} className="text-red-400" />
                <button
                  onClick={handleLogout}
                  className={`text-red-400 hover:text-red-500 hover:cursor-pointer ${
                    desktopCollapsed ? "md:hidden" : ""
                  }`}
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

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
    </>
  );
};

export default Sidebar; 