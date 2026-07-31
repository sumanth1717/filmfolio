import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Film, Compass, ShoppingBag, Users, Inbox, User as UserIcon, LogOut, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, unreadCount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">
            <Film size={24} className="text-amber" />
          </div>
          <span className="brand-title">FILM<span className="brand-accent">FOLIO</span></span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/feed" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Compass size={18} />
            <span>Feed</span>
          </NavLink>

          <NavLink to="/marketplace" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={18} />
            <span>Marketplace</span>
          </NavLink>

          <NavLink to="/directory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>Directory</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/inbox" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <div className="inbox-icon-wrap">
                <Inbox size={18} />
                {unreadCount > 0 && <span className="unread-dot">{unreadCount}</span>}
              </div>
              <span>Inbox</span>
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber" /> : <Moon size={18} className="text-cyan" />}
          </button>

          {isAuthenticated ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="profile-btn">
                <img
                  src={user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                  alt={user.name}
                  className="avatar-small"
                />
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </Link>

              <button onClick={handleLogout} className="btn-icon-logout" title="Log Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Join Platform</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar-header {
          background: rgba(11, 15, 23, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        [data-theme='light'] .navbar-header {
          background: rgba(255, 255, 255, 0.92);
        }

        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.9rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand { display: flex; align-items: center; gap: 0.6rem; }

        .logo-icon {
          width: 38px; height: 38px; border-radius: var(--radius-sm);
          background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3);
          display: flex; align-items: center; justify-content: center;
        }

        .text-amber { color: var(--primary-amber); }
        .text-cyan { color: var(--cyan-glow); }

        .brand-title {
          font-family: var(--font-title); font-size: 1.35rem; font-weight: 700;
          letter-spacing: 0.05em; color: var(--text-main);
        }

        .brand-accent { color: var(--primary-amber); }

        .nav-links { display: flex; align-items: center; gap: 1.5rem; }

        .nav-item {
          display: flex; align-items: center; gap: 0.45rem; color: var(--text-muted);
          font-weight: 500; font-size: 0.95rem; transition: color 0.2s ease; padding: 0.4rem 0.6rem;
          border-radius: var(--radius-sm);
        }

        .nav-item:hover, .nav-item.active { color: var(--primary-amber); }

        .inbox-icon-wrap { position: relative; display: flex; align-items: center; }

        .unread-dot {
          position: absolute; top: -6px; right: -8px; background: var(--rose-danger);
          color: white; font-size: 0.65rem; font-weight: 800; padding: 2px 5px;
          border-radius: 999px; line-height: 1;
        }

        .nav-actions { display: flex; align-items: center; gap: 1rem; }

        .theme-toggle-btn {
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.2s;
        }

        .theme-toggle-btn:hover { transform: scale(1.1); background: rgba(255, 255, 255, 0.1); }

        .user-profile-menu {
          display: flex; align-items: center; gap: 0.75rem;
          background: rgba(255, 255, 255, 0.05); padding: 0.35rem 0.75rem;
          border-radius: 999px; border: 1px solid var(--border-color);
        }

        .profile-btn {
          display: flex; align-items: center; gap: 0.5rem;
          color: var(--text-main); font-weight: 600; font-size: 0.9rem;
        }

        .avatar-small { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--primary-amber); }

        .btn-icon-logout {
          background: none; color: var(--text-muted); display: flex; align-items: center;
          padding: 0.2rem; border-radius: 4px; transition: color 0.2s;
        }

        .btn-icon-logout:hover { color: var(--rose-danger); }
        .auth-buttons { display: flex; gap: 0.6rem; }

        @media (max-width: 768px) {
          .nav-links span { display: none; }
          .brand-title { font-size: 1.1rem; }
        }
      `}</style>
    </header>
  );
}
