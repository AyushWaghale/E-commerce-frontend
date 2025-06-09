import React from 'react';

export default function LandingFooter() {
  return (
    <footer className="bg-text py-12 text-white">
      <div className="container mx-auto px-4 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            <span className="font-bold text-lg">Sales ForecastPro</span>
          </div>
          <p className="text-text-muted mb-4">Transform your business with accurate, AI-powered sales forecasting.</p>
          <div className="flex gap-3">
            <a href="#" className="text-text-muted hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
            <a href="#" className="text-text-muted hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>
            <a href="#" className="text-text-muted hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-text-muted hover:text-primary">Home</a></li>
            <li><a href="#features" className="text-text-muted hover:text-primary">Product</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Docs</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">About</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-text-muted hover:text-primary">Blog</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Case Studies</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Help Center</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Webinars</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-text-muted">
            <li className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> info@salesforecastpro.com</li>
            <li className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> +1 (555) 123-4567</li>
            <li className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> 123 Forecast Street, Suite 456, San Francisco, CA 94103</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-background pt-6 text-center text-text-muted text-sm">
        &copy; {new Date().getFullYear()} Sales ForecastPro. All rights reserved.
      </div>
    </footer>
  );
} 