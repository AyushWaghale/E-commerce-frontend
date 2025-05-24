import React from 'react';
import Header from '../components/Header';
import LandingHero from '../components/LandingHero';
import LandingFeatures from '../components/LandingFeatures';
import LandingFooter from '../components/LandingFooter';

export default function Landing() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
} 