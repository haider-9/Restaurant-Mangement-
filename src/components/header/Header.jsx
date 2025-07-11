import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "../common/buttons/AuthButton"
import MainButton from "../common/buttons/MainButton";
import { LayoutDashboardIcon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/landing/textLogo.svg"
import { useSelector } from "react-redux";
import { useToast } from "../common/toast/useToast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const { status, userData } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const navItems = [
    { label: "Overview", href: "#overview" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact Us", href: "#contact" },
  ];

  const { toast } = useToast()

  const handleDashboardIcon = () => {
    if (status && userData?.role !== "customer") {
      navigate("/dashboard")
    } else {
      toast({ title: 'Dashboard is not available for customer', variant: 'warning' });
      return;
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 512)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header
        className={`w-full px-3 md:px-10 flex justify-between items-center md:py-10 h-16 transition-transform duration-300 ${isSticky ? `` : 'absolute top-0 z-50 left-0'}`}
      // className="w-full px-3 md:px-16 py-6 flex justify-between items-center bg-transparent top-0 left-0 z-50 "
      >
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold ">
          <img src={logo} alt="" className="h-28 w-28 bg-amber-00" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-white lg:text-[18px]">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:scale-105 transition">
              {item.label}
            </a>
          ))}
          {
            status ? <button className="cursor-pointer" onClick={handleDashboardIcon}> <LayoutDashboardIcon /> </button> : <MainButton className="bg-white text-primary px-4"> <Link to="/auth/login">Sign In</Link></MainButton>
          }
        </nav>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Slide-In Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 right-0 w-2/4 max-w-xs h-auto bg-white z-50 p-6 shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-end items-center mb-6">
                <button onClick={() => setIsMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col space-y-4 text-gray-700 font-medium text-left">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-primary transition"
                  >
                    {item.label}
                  </a>
                ))}
                <AuthButton><Link to="/auth/login">Sign In</Link></AuthButton>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
