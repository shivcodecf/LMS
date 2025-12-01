import { Menu, School } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

/* ------------------------ Animated Hamburger ------------------------ */
const AnimatedHamburger = ({ isOpen, onClick }) => {
  return (
    <button
      aria-label={isOpen ? "Close menu" : "Open menu"}
      onClick={onClick}
      className="relative w-9 h-9 flex items-center justify-center"
    >
      <motion.span
        initial={false}
        animate={isOpen ? { rotate: 45, y: 2 } : { rotate: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="block w-6 h-[3px] rounded bg-gray-800 dark:bg-white"
      />
      <motion.span
        initial={false}
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.18 }}
        className="block w-6 h-[3px] rounded bg-gray-800 dark:bg-white absolute"
      />
      <motion.span
        initial={false}
        animate={isOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 6 }}
        transition={{ duration: 0.25 }}
        className="block w-6 h-[3px] rounded bg-gray-800 dark:bg-white"
      />
    </button>
  );
};

/* -------------------------------------------------------------------- */

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <>
      {/* Fixed header (z-50) */}
      <div className="fixed inset-x-0 top-0 z-50 bg-white dark:bg-[#020817] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop */}
          <div className="hidden md:flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <School size={28} />
                <span className="font-extrabold text-lg md:text-2xl">E-Learning</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* <div className="flex items-center">
                <DarkMode />
              </div> */}

              <div className="relative">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        aria-label="Open account menu"
                        className="rounded-full overflow-x-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Avatar className="overflow-x-hidden">
                          <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-56 bg-white dark:bg-[#0f172a]"
                      align="end"
                      sideOffset={8}
                      aria-label="Account options"
                    >
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>

                        {
                          user?.role === "student" && (

                             <DropdownMenuItem asChild>
                          <Link to="/my-learning">My Learning</Link>
                           </DropdownMenuItem>

                          )
                        }
                       
                        <DropdownMenuItem asChild>
                          <Link to="/profile">Edit Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
                      </DropdownMenuGroup>

                      {user?.role === "instructor" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/admin/dashboard">Dashboard</Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                      Login
                    </Button>
                    {/* <Button size="sm" onClick={() => navigate("/signup")}>
                      Signup
                    </Button> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile header */}
          <div className="flex md:hidden h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <School size={24} />
              <span className="font-bold text-lg">E-Learning</span>
            </Link>

            <div className="flex items-center gap-2">
              <DarkMode />
              <MobileNavbar user={user} logoutHandler={logoutHandler} />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer so content isn't hidden under fixed header */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
};

export default Navbar;

/* -------------------------------------------------------------------------- */
/* Mobile Navbar (Sheet) - polished, animated, locks body scroll               */
/* -------------------------------------------------------------------------- */
const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // lock body scroll while sheet is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = original || "";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div>
          <AnimatedHamburger isOpen={open} onClick={() => setOpen((v) => !v)} />
        </div>
      </SheetTrigger>

      {/* SheetContent: full-height, right panel. z-60 so it stacks above header */}
      <SheetContent
        className="p-0 m-0 bg-transparent"
        side="right"
        // if your Sheet supports a prop to remove its own backdrop, you can adjust it;
        // we're animating inside the SheetContent for consistent behavior
      >
        {/* Backdrop (animated) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm`}
          style={{ pointerEvents: open ? "auto" : "none" }}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: open ? 0 : "100%" }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 z-60 h-screen w-full sm:max-w-[420px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
          style={{ willChange: "transform" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
            <SheetTitle>
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <span className="font-semibold">E-Learning</span>
              </Link>
            </SheetTitle>

            <div className="flex items-center gap-2">
              <DarkMode />
              <SheetClose asChild>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </SheetClose>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 space-y-4">
            {/* <Link
              to="/courses"
              onClick={() => setOpen(false)}
              className="block rounded-md py-3 px-3 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              Courses
            </Link> */}

            {user ? (
              <>
                <Link
                  to="/my-learning"
                  onClick={() => setOpen(false)}
                  className="block rounded-md py-3 px-3 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  My Learning
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block rounded-md py-3 px-3 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Edit Profile
                </Link>

                {user?.role === "instructor" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setOpen(false)}
                    className="block rounded-md py-3 px-3 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    Instructor Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    logoutHandler();
                    setOpen(false);
                  }}
                  className="w-full text-left text-red-600 dark:text-red-400 py-3 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="w-full text-left py-3 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Login
                </button>
                {/* <button
                  onClick={() => {
                    navigate("/signup");
                    setOpen(false);
                  }}
                  className="w-full text-left py-3 px-3 rounded-md bg-blue-600 text-white"
                >
                  Signup
                </button> */}
              </>
            )}
          </div>

          {user?.role === "instructor" && (
            <div className="px-4 py-4 border-t border-gray-200 dark:border-slate-700">
              <SheetClose asChild>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/admin/dashboard");
                  }}
                  className="w-full py-3 rounded-md bg-gray-100 dark:bg-slate-800"
                >
                  Go to Dashboard
                </button>
              </SheetClose>
            </div>
          )}
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};
