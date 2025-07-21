import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bot,
  Heart,
  Home,
  MessageSquare,
  Music,
  Notebook,
  Menu,
  X,
  Lock,
  User,
  LogOut,
} from "lucide-react";
import { account } from "../lib/appwrite";

const navItems = [
  { name: "Home", icon: <Home size={20} />, path: "/" },
  { name: "Bhajan", icon: <Music size={20} />, path: "/bhajan" },
  { name: "Vaani", icon: <MessageSquare size={20} />, path: "/vaani" },
  { name: "Diary", icon: <Notebook size={20} />, path: "/diary" },
  { name: "Meditation", icon: <Heart size={20} />, path: "/meditation" },
  { name: "ChatBot", icon: <Bot size={20} />, path: "/chatbot" },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
  const toggleDesktopSidebar = () => setDesktopCollapsed(!desktopCollapsed);

  useEffect(() => {
    account
      .get()
      .then((res) => setUser(res))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await account.deleteSession("current");
    window.location.reload();
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
          {/* Mobile Close Button inside sidebar */}
          

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
                className={`flex items-center gap-2 ${
                  desktopCollapsed ? "md:justify-center" : ""
                }`}
              >
                <LogOut size={18} className="text-red-400" />
                <button
                  onClick={handleLogout}
                  className={`text-red-400 hover:text-red-500 ${
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
    </>
  );
};

export default Sidebar;
