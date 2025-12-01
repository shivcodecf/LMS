import React, { useEffect, useState } from "react";
import {
  ChartNoAxesColumn,
  SquareLibrary,
  Menu,
  X,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "dashboard", label: "Dashboard", Icon: ChartNoAxesColumn },
    { to: "course", label: "Courses", Icon: SquareLibrary },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow || "";
    }
    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [open]);

  return (
    // Use grid on large screens: sidebar 30% + content 1fr
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden
                    lg:grid lg:grid-cols-[22%_1fr]">
      {/* Mobile topbar with hamburger */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold">App</span>
        </div>
      </header>

      {/* Desktop Sidebar (30% width via grid column) */}
      <aside className="hidden lg:flex lg:flex-col mt-[50px] lg:sticky lg:top-0 lg:h-screen flex-shrink-0 p-6 border-r border-gray-300 dark:border-gray-700 bg-[#f0f0f0] dark:bg-gray-900/20">
        <div className="mt-6 space-y-6">
          {navItems.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Mobile overlay backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-30 transition-opacity pointer-events-none ${
          open ? "opacity-60 pointer-events-auto" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      />

      {/* Mobile slide-in sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-40 h-full w-[80%] max-w-xs transform bg-white dark:bg-gray-900 p-6 transition-transform shadow-xl ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Menu</span>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 space-y-3">
          {navItems.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:pt-0 overflow-x-hidden mt-[100px] ml-[50px]">
        {/* Constrain content width so table/form doesn't float in a huge space */}
        <div className="p-6 max-w-[1100px] w-full mx-auto box-border">
          {/* Helpful wrapper for wide tables / forms to avoid breaking layout */}
          <div className="w-full overflow-x-auto">
            {/* Page content */}
            <div className="min-w-0">
              {/* Outlet will render Dashboard / Courses pages */}
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
