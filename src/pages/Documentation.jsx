import React, { useEffect } from 'react';

const Documentation = () => {
  useEffect(() => {
    // Initialize the page when component mounts
    initializeNavigation();
    initializeMobileMenu();
    // Load the first item by default
    if (documentationData.length > 0) {
      loadContent(documentationData[0].id);
      document.querySelector('.nav-links a')?.classList.add('active');
    }
  }, []);

  // Sample documentation data
  const documentationData = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: `
        <div style="padding: 1rem; line-height: 1.7; font-size: 1.05rem; color: #333;">
          <h1 style="font-size: 2rem; color: #d97706; margin-bottom: 1rem;">What is Sales Forecasting?</h1>
          <p style="margin-bottom: 1rem;">
            Sales forecasting is the process of estimating future sales based on historical data, trends, and influencing factors. It enables businesses to plan, budget, and strategize effectively.
          </p>
          
          <h2 style="font-size: 1.5rem; color: #ea580c; margin-top: 2rem; margin-bottom: 0.5rem;">Objectives of Sales Forecasting</h2>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem;">
            <li>Improve inventory and logistics planning</li>
            <li>Set realistic sales and growth targets</li>
            <li>Support marketing and budgeting decisions</li>
            <li>Enhance customer satisfaction by avoiding stockouts</li>
          </ul>
  
          <h2 style="font-size: 1.5rem; color: #ea580c; margin-top: 2rem; margin-bottom: 0.5rem;">Applications</h2>
          <ul style="padding-left: 1.25rem;">
            <li>Strategic business planning</li>
            <li>Supply chain management</li>
            <li>Financial forecasting and investment planning</li>
            <li>Staff allocation and resource optimization</li>
          </ul>
        </div>
      `
    },
    {
      id: 'data-format',
      title: 'Data Format',
      content: `
        <div style="padding: 1rem; line-height: 1.7; font-size: 1.05rem; color: #333;">
          <h1 style="font-size: 2rem; color: #d97706; margin-bottom: 1rem;">Expected Data Format</h1>
          <p style="margin-bottom: 1rem;">
            Our platform expects a structured <strong>CSV file</strong> containing clean and consistent sales records. Example:
          </p>
          <pre style="background: #fef3c7; padding: 0.75rem; border-radius: 8px; overflow-x: auto; font-size: 0.95rem; margin-bottom: 1rem;">
  Date, Product_ID, Sales_Units, Price, Discount
  2024-01-01, A123, 40, 19.99, 0.05
          </pre>
  
          <h2 style="font-size: 1.5rem; color: #ea580c; margin-top: 2rem; margin-bottom: 0.5rem;">Parameter Importance</h2>
          <ul style="padding-left: 1.25rem;">
            <li><strong>Date:</strong> For detecting time-based trends and seasonality.</li>
            <li><strong>Product_ID:</strong> Identifies unique products and allows category grouping.</li>
            <li><strong>Sales_Units:</strong> Core metric for measuring performance.</li>
            <li><strong>Price:</strong> Impacts demand and revenue directly.</li>
            <li><strong>Promotion:</strong> Helps track sales influenced by discounts or marketing.</li>
            <li><strong>Region:</strong> Useful for geographic segmentation and local trends.</li>
          </ul>
        </div>
      `
    },
    {
      id: 'external-factors',
      title: 'External Factors',
      content: `
        <div style="padding: 1rem; line-height: 1.7; font-size: 1.05rem; color: #333;">
          <h1 style="font-size: 2rem; color: #d97706; margin-bottom: 1rem;">Key External Factors</h1>
          <p style="margin-bottom: 1rem;">
            Sales forecasting is influenced by a range of external variables. Our platform incorporates the following six critical factors:
          </p>
  
          <ul style="padding-left: 1.25rem;">
            <li><strong>Historical Sales:</strong> Basis for recognizing trends and seasonality patterns over time.</li>
            <li><strong>Seasonal Trends:</strong> Captures the effect of recurring events such as holidays and climate seasons.</li>
            <li><strong>Economic Indicators:</strong> Includes factors like GDP, inflation rates, and consumer spending power.</li>
            <li><strong>Promotions:</strong> Discounts and campaigns can cause sales spikes that need contextual understanding.</li>
            <li><strong>Market Demand:</strong> Overall customer need or interest for a product or category.</li>
            <li><strong>Competitor Activity:</strong> Pricing strategies, launches, and marketing efforts by rivals influence your sales.</li>
          </ul>
        </div>
      `
    }
  ];

  // Function to initialize the navigation
  const initializeNavigation = () => {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;
    
    documentationData.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${item.id}`;
      a.textContent = item.title;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        loadContent(item.id);
        // Update active state
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
        });
        a.classList.add('active');
        // Close mobile menu if open
        closeMobileMenu();
      });
      li.appendChild(a);
      navLinks.appendChild(li);
    });
  };

  // Function to load content
  const loadContent = (id) => {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
    const item = documentationData.find(item => item.id === id);
    if (item) {
      // Remove animation class if it exists
      contentArea.classList.remove('content-animate');
      // Force reflow
      void contentArea.offsetWidth;
      // Add animation class
      contentArea.classList.add('content-animate');
      contentArea.innerHTML = item.content;
    }
  };

  // Mobile menu functionality
  const initializeMobileMenu = () => {
    const menuToggle = document.getElementById('menuToggle');
    const container = document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');
    if (!menuToggle || !container || !sidebar) return;

    menuToggle.addEventListener('click', () => {
      container.classList.toggle('sidebar-active');
      sidebar.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  };

  const closeMobileMenu = () => {
    const container = document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');
    if (!container || !sidebar) return;
    
    container.classList.remove('sidebar-active');
    sidebar.classList.remove('active');
  };

  return (
    <div >
      <button className="menu-toggle" id="menuToggle">☰</button>
      <div className="container">
        <nav className="sidebar">
          <div onClick={() => window.location.href = '/'} className="logo">
            <h2 >Docs</h2>
          </div>
          <ul className="nav-links" id="navLinks">
            {/* Navigation links will be dynamically added here */}
          </ul>
        </nav>
        <main className="content">
          <div id="contentArea">
            {/* Content will be dynamically added here */}
          </div>
        </main>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #ff6b00;
          --primary-light: #ff8533;
          --primary-dark: #cc5500;
          --text-color: #333;
          --bg-color: #fff;
          --sidebar-width: 250px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          color: var(--text-color);
          line-height: 1.6;
        }

        .container {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--primary-color);
          color: white;
          padding: 20px;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          transition: transform 0.3s ease;
          z-index: 1000;
        }

        .logo {
          padding: 20px 0;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 20px;
        }

        .nav-links {
          list-style: none;
          position: relative;
        }

        .nav-links li {
          margin-bottom: 10px;
          position: relative;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          display: block;
          padding: 10px;
          border-radius: 5px;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .nav-links a::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--primary-light);
          border-radius: 5px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
          z-index: -1;
        }

        .nav-links a:hover::before {
          transform: scaleX(1);
        }

        .content {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding: 40px;
          background-color: var(--bg-color);
          transition: margin-left 0.3s ease;
        }

        .content h1 {
          color: var(--primary-color);
          margin-bottom: 20px;
        }

        .content p {
          margin-bottom: 15px;
        }

        .nav-links a.active {
          background-color: var(--primary-dark);
          font-weight: bold;
        }

        .menu-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: var(--primary-color);
          border: none;
          color: white;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }

        @media screen and (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.active {
            transform: translateX(0);
          }

          .content {
            margin-left: 0;
            padding: 20px;
            padding-top: 60px;
          }

          .container.sidebar-active .sidebar {
            transform: translateX(0);
          }

          .container.sidebar-active .content {
            margin-left: var(--sidebar-width);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content-animate {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Documentation; 