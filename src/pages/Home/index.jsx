import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/NavBar/Navbar';

const Home = () => {
  useEffect(() => {
    // Add animation classes to elements when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="badge animate-fade-in">AI-Powered Resume Analysis</span>
            <h1 className="animate-slide-up">Optimize Your Resume with AI</h1>
            <p className="text-gray animate-slide-up">
              Get instant feedback on your resume, improve your chances of landing interviews, and stand out from the competition.
            </p>
            <div className="hero-buttons animate-slide-up">
              <Link to="/analyzer" className="btn btn-primary">
                Analyze Your Resume
              </Link>
              <Link to="/analyzer" className="btn btn-secondary">
                Try Sample
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="feature-grid">
            <div className="feature-card animate-fade-in">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3>Upload Resume</h3>
              <p className="text-gray">Simply upload your resume in PDF format</p>
            </div>

            <div className="feature-card animate-fade-in">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>AI Analysis</h3>
              <p className="text-gray">Get detailed feedback on your resume</p>
            </div>

            <div className="feature-card animate-fade-in">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3>Smart Suggestions</h3>
              <p className="text-gray">Receive actionable improvement tips</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-title animate-fade-in">
            <span className="badge">Why Choose Us</span>
            <h2>Why Choose ResumeAnalyzer?</h2>
            <p className="text-gray">
              Our AI-powered platform helps you create a resume that stands out and gets noticed by employers.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card animate-fade-in">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>AI-Powered Analysis</h3>
              <p className="text-gray">
                Get detailed feedback on your resume's content, formatting, and overall effectiveness.
              </p>
            </div>

            <div className="feature-card animate-fade-in">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3>Smart Suggestions</h3>
              <p className="text-gray">
                Receive actionable recommendations to improve your resume and increase your chances of getting hired.
              </p>
            </div>

            <div className="feature-card animate-fade-in">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Instant Results</h3>
              <p className="text-gray">
                Get your analysis in seconds, with no waiting time or complicated setup required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="cta-card animate-fade-in">
            <span className="badge">Get Started</span>
            <h2>Ready to Optimize Your Resume?</h2>
            <p className="text-gray">
              Start analyzing your resume now and get personalized feedback to improve your chances of landing your dream job.
            </p>
            <Link to="/analyzer" className="btn btn-primary">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4 className="footer-title">ResumeAnalyzer</h4>
              <p className="text-gray">
                AI-powered resume analysis and optimization platform.
              </p>
            </div>
            <div>
              <h5 className="footer-heading">Product</h5>
              <ul className="footer-links">
                <li><Link to="#">Features</Link></li>
                <li><Link to="#">Pricing</Link></li>
                <li><Link to="#">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="footer-heading">Company</h5>
              <ul className="footer-links">
                <li><Link to="#">About</Link></li>
                <li><Link to="#">Blog</Link></li>
                <li><Link to="#">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="footer-heading">Legal</h5>
              <ul className="footer-links">
                <li><Link to="#">Privacy</Link></li>
                <li><Link to="#">Terms</Link></li>
                <li><Link to="#">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} ResumeAnalyzer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;