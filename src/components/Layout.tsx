import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

// This is a special prop that tells React to render any child components
// that are passed to this component.
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // 1. Get the current location object from React Router
  const location = useLocation();
  
  // 2. Define the list of paths where the navbar should be hidden.
  // For now, it's just the landing page.
  const hideNavbarOnPaths = ['/'];

  // 3. Check if the current pathname is in our list of hidden paths.
  const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <>
      {/* 4. Only render the Navbar if shouldShowNavbar is true */}
      {shouldShowNavbar && <Navbar />}
      
      {/* This will render the rest of the application (our <Routes>) */}
      <main>{children}</main>
    </>
  );
};

export default Layout;