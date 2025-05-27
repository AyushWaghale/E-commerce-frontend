import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function LandingFooter() {
  return (
    <footer className="bg-gradient-to-b from-text to-text/90 py-12 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-4"
        >
          <motion.div variants={itemVariants} className="md:col-span-1">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-2"
            >
              <motion.svg 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
              >
                <line x1="18" x2="18" y1="20" y2="10"/>
                <line x1="12" x2="12" y1="20" y2="4"/>
                <line x1="6" x2="6" y1="20" y2="14"/>
              </motion.svg>
              <span className="font-bold text-lg">Sales ForecastPro</span>
            </motion.div>
            <p className="text-text-muted mb-4">Transform your business with accurate, AI-powered sales forecasting.</p>
            <div className="flex gap-3">
              <motion.a 
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#" 
                className="text-text-muted hover:text-primary transition-colors duration-200"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#" 
                className="text-text-muted hover:text-primary transition-colors duration-200"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#" 
                className="text-text-muted hover:text-primary transition-colors duration-200"
              >
                <Facebook size={20} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Product', 'Docs', 'About'].map((link) => (
                <motion.li 
                  key={link}
                  whileHover={{ x: 5 }}
                  className="transition-colors duration-200"
                >
                  <a href="#" className="text-text-muted hover:text-primary flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              {['Blog', 'Case Studies', 'Help Center', 'Webinars'].map((resource) => (
                <motion.li 
                  key={resource}
                  whileHover={{ x: 5 }}
                  className="transition-colors duration-200"
                >
                  <a href="#" className="text-text-muted hover:text-primary flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {resource}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-text-muted">
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-start gap-2 transition-colors duration-200 hover:text-primary"
              >
                <Mail size={20} className="flex-shrink-0 mt-1" />
                <span>info@salesforecastpro.com</span>
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-start gap-2 transition-colors duration-200 hover:text-primary"
              >
                <Phone size={20} className="flex-shrink-0 mt-1" />
                <span>+1 (555) 123-4567</span>
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-start gap-2 transition-colors duration-200 hover:text-primary"
              >
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>123 Forecast Street, Suite 456, San Francisco, CA 94103</span>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 border-t border-background/20 pt-6 text-center text-text-muted text-sm"
        >
          &copy; {new Date().getFullYear()} Sales ForecastPro. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
} 