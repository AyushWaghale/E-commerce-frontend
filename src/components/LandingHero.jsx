import React from 'react';

const benefits = [
  'Reduce inventory costs by up to 30%',
  'Improve cash flow management',
  'Optimize resource allocation',
  'Make data-driven decisions',
];

export default function LandingHero() {
  return (
    <section className="pt-28 pb-16 bg-gradient-to-br from-background-card to-background">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text">
            Transform Your <span className="text-primary">Sales Predictions</span> with AI
          </h1>
          <p className="text-lg text-text-muted mb-6">
            Make data-driven decisions with confidence. Our AI-powered forecasting delivers up to 95% accuracy, helping you plan inventory, optimize resources, and maximize revenue.
          </p>
          <ul className="mb-8 space-y-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center text-text-muted">
                <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn bg-primary text-white font-semibold px-6 py-3 rounded-md shadow hover:bg-primary-dark transition">Get Started Free <span className="ml-2">→</span></button>
            <button className="btn border-2 border-primary text-primary font-semibold px-6 py-3 rounded-md hover:bg-primary-light transition">Watch Demo</button>
          </div>
          <div className="mt-6 p-4 bg-primary-light border border-primary rounded-lg">
            <p>
              <span className="font-bold text-primary">Why Sales Forecasting Matters:</span> In today's dynamic market, accurate sales forecasting is crucial for business success. Companies using AI-powered forecasting see an average 25% reduction in forecast errors and 20% increase in revenue growth.
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          {/* Placeholder for dashboard preview/visual */}
          <div className="bg-background-card rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-text">Sales Forecast Dashboard</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-light rounded-lg p-4 flex flex-col items-center">
                <svg className="w-10 h-10 text-primary mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                <span className="text-sm text-text-muted">Revenue Split</span>
              </div>
              <div className="bg-primary-light rounded-lg p-4 flex flex-col items-center">
                <svg className="w-10 h-10 text-primary mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                <span className="text-sm text-text-muted">Monthly Trends</span>
              </div>
              <div className="bg-primary-light rounded-lg p-4 flex flex-col items-center col-span-2">
                <svg className="w-10 h-10 text-primary mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                <span className="text-sm text-text-muted">Year-over-Year Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 