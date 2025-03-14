
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between max-w-6xl">
        <div className="mb-4 md:mb-0 flex items-center">
          <span className="text-lg font-bold mr-2">NutriTrack</span>
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
        </div>
        
        <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-end text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
            Sign Up
          </Link>
          <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
