import React from 'react';

const features = [
  {
    title: 'AI-Powered Predictions',
    description: 'Our machine learning algorithms analyze historical data and market trends to provide accurate sales forecasts.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
    ),
  },
  {
    title: 'Real-time Analytics',
    description: 'Monitor your sales performance in real-time and make data-driven decisions on the fly.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
    ),
  },
  {
    title: 'Trend Identification',
    description: 'Automatically identify emerging trends and patterns in your sales data.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
    ),
  },
  {
    title: 'Anomaly Detection',
    description: 'Get alerted when sales patterns deviate from expectations, allowing for proactive intervention.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
    ),
  },
  {
    title: 'Seasonal Forecasting',
    description: 'Account for seasonal variations in your sales projections for more accurate planning.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
  },
  {
    title: 'Data Integration',
    description: 'Seamlessly connect with your existing CRM, ERP, and other data sources.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
    ),
  },
];

export default function LandingFeatures() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text">
            Powerful Features for <span className="text-primary">Accurate Forecasting</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Our platform combines advanced algorithms with an intuitive interface to give you the insights you need.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="bg-background-card rounded-xl p-8 shadow hover:shadow-lg border border-background transition">
              <div className="mb-4 flex items-center justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-text">{feature.title}</h3>
              <p className="text-text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 