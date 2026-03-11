"use client";
import React, { useState, useEffect } from 'react';
import { Menu, Globe, UserCircle, X, LogIn, UserPlus, Settings, HelpCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // ← AJOUTER CET IMPORT
import { usePathname } from 'next/navigation'; 

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthPage, setIsAuthPage] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier si on est sur une page d'authentification
    const authPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reinitialiser-mot-de-passe'];
    setIsAuthPage(authPaths.includes(pathname));
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (scrolled) {
      setIsUserMenuOpen(false);
    }
  }, [scrolled]);

  const handleNavClick = (): void => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = (): void => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  const handleMobileMenuToggle = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const handleLogin = () => {
    window.location.href = '/auth/login';
  };

  const handleSignup = () => {
    window.location.href = '/auth/signup';
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Ne rien afficher sur les pages d'authentification
  if (isAuthPage) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || isMobileMenuOpen ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
        {/* Logo avec Image */}
        <Link 
  href="/" 
  className="flex items-center gap-2 cursor-pointer group z-50"
  onClick={handleNavClick}
  aria-label="Accueil - Retour à la page d'accueil"
>
  <Image
    src="/logo.png"
    alt="ImmoBenin Logo"
    width={90}
    height={70}
    className="w-auto h-10 sm:h-10 md:h-12 lg:h-16 xl:h-20 object-contain group-hover:scale-110 transition-transform duration-300"
    priority
  />
</Link>

        {/* Desktop Navigation avec Link */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700" aria-label="Navigation principale">
          <Link 
            href="/" 
            className={`hover:text-brand transition-colors ${isActive('/') ? 'text-brand font-semibold' : ''}`}
            onClick={handleNavClick}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Accueil
          </Link>
          <Link 
            href="/search" 
            className={`hover:text-brand transition-colors ${isActive('/search') ? 'text-brand font-semibold' : ''}`}
            onClick={handleNavClick}
            aria-current={isActive('/search') ? 'page' : undefined}
          >
            Rechercher
          </Link>
          <Link 
            href="/contact" 
            className={`hover:text-brand transition-colors ${isActive('/contact') ? 'text-brand font-semibold' : ''}`}
            onClick={handleNavClick}
            aria-current={isActive('/contact') ? 'page' : undefined}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2 z-50">
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-2 relative">
            <button 
              className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium"
              aria-label="Changer la langue"
              type="button"
            >
              <Globe className="w-4 h-4" />
              <span>FR</span>
            </button>
            
            {/* Bouton menu utilisateur avec modale */}
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center gap-2 border border-gray-300 rounded-full pl-3 pr-2 py-1.5 hover:shadow-md transition-shadow bg-white"
                aria-label="Menu utilisateur"
                aria-expanded={isUserMenuOpen}
                type="button"
              >
                <Menu className="w-4 h-4 text-gray-600" />
                <UserCircle className="w-8 h-8 text-gray-500 fill-current" />
              </button>

              {/* Modale utilisateur desktop */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="py-2">
                      {!isLoggedIn ? (
                        <>
                          <button
                            onClick={handleLogin}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 hover:text-brand transition-colors"
                          >
                            <LogIn className="w-5 h-5" />
                            <span className="font-medium">Se connecter</span>
                          </button>
                          <button
                            onClick={handleSignup}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 hover:text-brand transition-colors border-t border-gray-100"
                          >
                            <UserPlus className="w-5 h-5" />
                            <span className="font-medium">Créer un compte</span>
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link 
                            href="/contact"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
                            onClick={handleNavClick}
                          >
                            <HelpCircle className="w-5 h-5" />
                            <span className="font-medium">Aide et support</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-medium text-gray-900">John Doe</p>
                            <p className="text-sm text-gray-500">john@example.com</p>
                          </div>
                          <button
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 hover:text-brand transition-colors"
                          >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Mon profil</span>
                          </button>
                          <Link 
                            href="/contact"
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 hover:text-brand transition-colors"
                            onClick={handleNavClick}
                          >
                            <HelpCircle className="w-5 h-5" />
                            <span className="font-medium">Aide</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors border-t border-gray-100"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Déconnexion</span>
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2 text-gray-700 bg-white rounded-full hover:bg-gray-100 shadow-sm border border-gray-100"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu mobile" 
          >
            <nav className="flex flex-col p-6 gap-4 text-lg font-medium text-gray-800">
              {/* Liens de navigation */}
              <Link 
                href="/" 
                className={`py-2 hover:text-brand transition-colors ${isActive('/') ? 'text-brand font-semibold' : ''}`}
                onClick={handleNavClick}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Accueil
              </Link>
              <Link 
                href="/search" 
                className={`py-2 hover:text-brand transition-colors ${isActive('/search') ? 'text-brand font-semibold' : ''}`}
                onClick={handleNavClick}
                aria-current={isActive('/search') ? 'page' : undefined}
              >
                Rechercher
              </Link>
              <Link 
                href="/contact" 
                className={`py-2 hover:text-brand transition-colors ${isActive('/contact') ? 'text-brand font-semibold' : ''}`}
                onClick={handleNavClick}
                aria-current={isActive('/contact') ? 'page' : undefined}
              >
                Contact
              </Link>

              <Link 
                href="/auth/signup"
                className="flex items-center gap-3 py-3 text-gray-700 hover:text-brand transition-colors"
                onClick={handleNavClick}
              >
                <UserPlus className="w-5 h-5 text-brand" />
                <span className="font-medium">S'inscrire</span>
              </Link>

              <Link 
                href="/auth/login"
                className="flex items-center gap-3 py-3 text-gray-700 hover:text-brand transition-colors"
                onClick={handleNavClick}
              >
                <LogIn className="w-5 h-5 text-brand" />
                <span className="font-medium">Se connecter</span>
              </Link>

              {/* Options supplémentaires */}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-gray-100">
                <button 
                  className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-brand transition-colors"
                  type="button"
                  aria-label="Changer la langue"
                >
                  <Globe className="w-5 h-5" /> 
                  <span>Français</span>
                </button>
                <Link 
                  href="/contact"
                  className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-brand transition-colors"
                  onClick={handleNavClick}
                  aria-label="Aide et support"
                >
                  <HelpCircle className="w-5 h-5" /> 
                  <span>Aide et support</span>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};