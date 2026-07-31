import React from 'react';
import { Film, Heart, Github, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Film size={20} className="text-amber" />
            <span className="brand-title">FILMFOLIO</span>
          </div>
          <p className="footer-tagline">
            Empowering independent filmmakers to connect, recruit crew, hire gear, and bring stories to life.
          </p>
        </div>

        <div className="footer-links-group">
          <h4>Platform</h4>
          <a href="/feed">Crew Feed</a>
          <a href="/marketplace">Gear Marketplace</a>
          <a href="/directory">Filmmaker Directory</a>
        </div>

        <div className="footer-links-group">
          <h4>Architecture</h4>
          <span>MongoDB Atlas</span>
          <span>Express REST API</span>
          <span>React 18 + Vite</span>
          <span>Node.js Backend</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FilmFolio MERN Platform. Crafted with precision for filmmakers worldwide.</p>
      </div>

      <style>{`
        .footer-wrap {
          background: #070a10;
          border-top: 1px solid var(--border-color);
          padding: 3rem 1.5rem 1.5rem;
          margin-top: 4rem;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 2rem;
          padding-bottom: 2rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .footer-tagline {
          color: var(--text-muted);
          font-size: 0.9rem;
          max-width: 400px;
        }

        .footer-links-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-links-group h4 {
          color: white;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }

        .footer-links-group a, .footer-links-group span {
          color: var(--text-muted);
          font-size: 0.85rem;
          transition: color 0.2s;
        }

        .footer-links-group a:hover {
          color: var(--primary-amber);
        }

        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-dim);
        }

        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
