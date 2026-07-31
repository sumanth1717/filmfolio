import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Camera, Users, ArrowRight, ShieldCheck, Zap, Sparkles, MapPin, CheckCircle, Sliders } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} className="text-amber" />
          <span>The Premier Filmmaker Collaboration & Gear Platform</span>
        </div>

        <h1 className="hero-title">
          Connect, Hire Crew, & Rent Gear for Your Next <span className="title-gradient">Masterpiece</span>
        </h1>

        <p className="hero-subtitle">
          FilmFolio bridges independent directors, cinematographers, sound engineers, and crew in Vijayawada, Guntur & AP region with high-end production equipment and talent.
        </p>

        <div className="hero-cta">
          <Link to="/feed" className="btn btn-primary btn-lg">
            <span>Explore Crew Feed</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/marketplace" className="btn btn-secondary btn-lg">
            <Camera size={18} />
            <span>Gear Marketplace</span>
          </Link>
        </div>

        {/* Live Metrics Stats Banner */}
        <div className="stats-banner">
          <div className="stat-box">
            <span className="stat-num">40+</span>
            <span className="stat-label">Verified AP Filmmakers</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">₹1.5L+</span>
            <span className="stat-label">Cinema Packages Listed</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">100%</span>
            <span className="stat-label">Verified Rental Contracts</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon icon-amber">
              <Film size={26} className="text-amber" />
            </div>
            <h3>Crew & Cast Feed</h3>
            <p>Post crew calls or pitch your specialized production skills for upcoming short films, web series, and feature productions in Vijayawada & Guntur.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-cyan">
              <Camera size={26} className="text-cyan" />
            </div>
            <h3>Peer-to-Peer Gear Rental</h3>
            <p>List your ARRI Alexa 35, RED V-Raptor, Anamorphic lenses, Aputure lighting, and Sound Devices packages to earn daily rental income.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-emerald">
              <Users size={26} className="text-emerald" />
            </div>
            <h3>Local Filmmaker Directory</h3>
            <p>Discover nearby verified cinematographers, gaffers, sound mixers, and editors filtered accurately by city location and technical skills.</p>
          </div>
        </div>
      </section>

      {/* Quick City & Category Quick Explorer */}
      <section className="explorer-section card">
        <div className="explorer-header">
          <div>
            <h2><MapPin size={22} className="text-amber" /> Explore Production Gear by Location</h2>
            <p>Direct access to active camera packages, lighting rigs, and crew callouts in your city.</p>
          </div>
        </div>

        <div className="location-chips-grid">
          <Link to="/marketplace?location=Vijayawada" className="location-chip">
            <span>📍 Vijayawada, AP</span>
            <span className="chip-badge">12 Packages</span>
          </Link>
          <Link to="/marketplace?location=Guntur" className="location-chip">
            <span>📍 Guntur, AP</span>
            <span className="chip-badge">8 Packages</span>
          </Link>
          <Link to="/marketplace?location=Mangalagiri" className="location-chip">
            <span>📍 Mangalagiri, AP</span>
            <span className="chip-badge">5 Packages</span>
          </Link>
          <Link to="/marketplace?location=Amaravati" className="location-chip">
            <span>📍 Amaravati, AP</span>
            <span className="chip-badge">4 Packages</span>
          </Link>
        </div>
      </section>

      {/* Workflow Explanation Banner */}
      <section className="architecture-banner">
        <div className="banner-content">
          <div className="banner-tag"><CheckCircle size={14} /> Certified MERN Architecture</div>
          <h2>Built for Scalability, Security, & Performance</h2>
          <p>
            Powered by a modular Express REST API, MongoDB data models, JWT authentication, Multer file handling, and a responsive React SPA.
          </p>
          {!isAuthenticated && (
            <Link to="/signup" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              Create Your Free Filmmaker Account
            </Link>
          )}
        </div>
      </section>

      <style>{`
        .home-page {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .hero-section {
          text-align: center;
          max-width: 960px;
          margin: 1.5rem auto 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: var(--primary-amber);
          padding: 0.4rem 1rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-family: var(--font-sans);
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.25;
          color: var(--text-main);
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }

        .title-gradient {
          background: linear-gradient(135deg, #f59e0b 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          color: var(--text-muted);
          font-size: 1.15rem;
          max-width: 720px;
          margin-bottom: 2rem;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .btn-lg {
          padding: 0.85rem 1.8rem;
          font-size: 1.05rem;
        }

        .stats-banner {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem 2rem;
          margin-bottom: 3rem;
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-num {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-amber);
        }

        .stat-label {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          width: 100%;
          text-align: left;
        }

        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 2rem;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-amber);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .icon-amber { background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.25); }
        .icon-cyan { background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.25); }
        .icon-emerald { background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.25); }

        .feature-card h3 {
          color: var(--text-main);
          font-size: 1.2rem;
          margin-bottom: 0.6rem;
          font-weight: 700;
        }

        .feature-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .explorer-section {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .explorer-header h2 {
          color: var(--text-main);
          font-size: 1.35rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .explorer-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 0.2rem;
        }

        .location-chips-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .location-chip {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-sm);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-main);
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .location-chip:hover {
          border-color: var(--primary-amber);
          color: var(--primary-amber);
          transform: translateY(-2px);
        }

        .chip-badge {
          background: rgba(245, 158, 11, 0.15);
          color: var(--primary-amber);
          font-size: 0.72rem;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }

        .architecture-banner {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 3.5rem 2rem;
          text-align: center;
        }

        .banner-content {
          max-width: 650px;
          margin: 0 auto;
        }

        .banner-tag {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--cyan-glow);
          margin-bottom: 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .banner-content h2 {
          color: var(--text-main);
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .banner-content p {
          color: var(--text-muted);
          font-size: 1rem;
        }

        @media (max-width: 900px) {
          .hero-title { font-size: 2.2rem; }
          .features-grid { grid-template-columns: 1fr; }
          .location-chips-grid { grid-template-columns: 1fr 1fr; }
          .stats-banner { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
