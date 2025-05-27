import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';

const benefits = [
  'Reduce inventory costs by up to 30%',
  'Improve cash flow management',
  'Optimize resource allocation',
  'Make data-driven decisions',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function LandingHero() {
  return (
    <section className="pt-28 pb-16 bg-gradient-to-br from-background-card to-background relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4 text-text"
          >
            Transform Your <span className="text-primary relative">
              Sales Predictions
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-1 bg-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </span> with AI
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-text-muted mb-6"
          >
            Make data-driven decisions with confidence. Our AI-powered forecasting delivers up to 95% accuracy, helping you plan inventory, optimize resources, and maximize revenue.
          </motion.p>

          <motion.ul 
            variants={containerVariants}
            className="mb-8 space-y-3"
          >
            {benefits.map((b, i) => (
              <motion.li 
                key={i} 
                variants={itemVariants}
                className="flex items-center text-text-muted group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-5 h-5 text-primary mr-2 flex-shrink-0"
                >
                  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="m9 11 3 3L22 4"/>
                  </svg>
                </motion.div>
                <span className="group-hover:text-primary transition-colors duration-200">{b}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn bg-primary text-white font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-primary-dark transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn border-2 border-primary text-primary font-semibold px-6 py-3 rounded-md hover:bg-primary-light transition-all duration-200 flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-6 p-4 bg-primary-light/20 border border-primary/20 rounded-lg backdrop-blur-sm"
          >
            <p>
              <span className="font-bold text-primary">Why Sales Forecasting Matters:</span> In today's dynamic market, accurate sales forecasting is crucial for business success. Companies using AI-powered forecasting see an average 25% reduction in forecast errors and 20% increase in revenue growth.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center items-center"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-background-card rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-200/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold mb-4 text-text">Sales Forecast Dashboard</h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-primary-light/20 rounded-lg p-4 flex flex-col items-center hover:bg-primary-light/30 transition-colors duration-200"
              >
                <motion.svg 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 text-primary mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                </motion.svg>
                <span className="text-sm text-text-muted">Revenue Split</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-primary-light/20 rounded-lg p-4 flex flex-col items-center hover:bg-primary-light/30 transition-colors duration-200"
              >
                <motion.svg 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 text-primary mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <line x1="18" x2="18" y1="20" y2="10"/>
                  <line x1="12" x2="12" y1="20" y2="4"/>
                  <line x1="6" x2="6" y1="20" y2="14"/>
                </motion.svg>
                <span className="text-sm text-text-muted">Monthly Trends</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-primary-light/20 rounded-lg p-4 flex flex-col items-center col-span-2 hover:bg-primary-light/30 transition-colors duration-200"
              >
                <motion.svg 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 text-primary mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3v18h18"/>
                  <path d="m19 9-5 5-4-4-3 3"/>
                </motion.svg>
                <span className="text-sm text-text-muted">Year-over-Year Growth</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 