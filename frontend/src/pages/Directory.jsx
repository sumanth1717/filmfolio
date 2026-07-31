import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, MapPin, Briefcase, Mail, UserCheck } from 'lucide-react';
import { getDirectory, getErrorMessage } from '../services/api';

export default function Directory() {
  const [filmmakers, setFilmmakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [locationSelect, setLocationSelect] = useState('All');
  const [skillSearch, setSkillSearch] = useState('');
  const [keywordSearch, setKeywordSearch] = useState('');

  const cityOptions = ['All', 'Vijayawada', 'Guntur', 'Mangalagiri', 'Amaravati', 'Visakhapatnam (Vizag)', 'Hyderabad'];

  const fetchDirectory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getDirectory({
        location: locationSelect === 'All' ? '' : locationSelect,
        skill: skillSearch,
        search: keywordSearch
      });
      if (data.success) {
        setFilmmakers(data.filmmakers || []);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, [locationSelect]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDirectory();
  };

  return (
    <div className="directory-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={28} className="text-amber" /> Local Filmmaker Directory
          </h1>
          <p className="page-subtitle">Discover verified directors, cinematographers, sound designers, and crew in Vijayawada, Guntur, and nearby cities.</p>
        </div>
      </div>

      {/* Filter Controls */}
      <form onSubmit={handleSearchSubmit} className="card search-card">
        <div className="search-grid">
          <div className="input-field-wrap">
            <MapPin size={16} className="field-icon" />
            <select
              value={locationSelect}
              onChange={(e) => setLocationSelect(e.target.value)}
              className="location-select-box"
            >
              <option value="All">All Cities (Vijayawada & Guntur Region)</option>
              {cityOptions.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="input-field-wrap">
            <Briefcase size={16} className="field-icon" />
            <input
              type="text"
              placeholder="Filter by Role / Skill (e.g. Director, Gaffer, DP)"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <Search size={16} /> Search Directory
          </button>
        </div>
      </form>

      {/* Filmmakers Grid */}
      {loading ? (
        <div className="loading-center">
          <div className="spinner"></div>
          <p>Finding local filmmakers...</p>
        </div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : filmmakers.length === 0 ? (
        <div className="empty-state card">
          <h3>No filmmakers found</h3>
          <p>Try refining your location or role search filters.</p>
        </div>
      ) : (
        <div className="filmmaker-grid">
          {filmmakers.map((person) => (
            <div key={person._id} className="card person-card">
              <div className="person-header">
                <Link to={`/profile/${person._id}`}>
                  <img
                    src={person.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={person.name}
                    className="person-avatar"
                  />
                </Link>
                <div>
                  <Link to={`/profile/${person._id}`} className="person-name-link">
                    <h3 className="person-name">{person.name}</h3>
                  </Link>
                  <div className="person-location">
                    <MapPin size={13} className="text-amber" />
                    <span>{person.location || 'Vijayawada, AP'}</span>
                  </div>
                </div>
              </div>

              <p className="person-bio">{person.bio || 'Professional filmmaker on FilmFolio network.'}</p>

              <div className="person-skills">
                {person.skills && person.skills.map((skill, i) => (
                  <span key={i} className="badge badge-cyan">{skill}</span>
                ))}
              </div>

              <div className="person-footer">
                <Link to={`/profile/${person._id}`} className="btn btn-secondary btn-sm full-width">
                  <UserCheck size={14} /> View Full Profile & Portfolio
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .directory-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .search-card { padding: 1.25rem; }

        .search-grid {
          display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem;
        }

        .input-field-wrap { position: relative; display: flex; align-items: center; }
        .field-icon { position: absolute; left: 12px; color: var(--text-muted); z-index: 2; }
        .input-field-wrap input, .location-select-box { padding-left: 2.2rem; }

        .filmmaker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .person-card { display: flex; flex-direction: column; gap: 1rem; }

        .person-header { display: flex; align-items: center; gap: 0.85rem; }
        .person-avatar {
          width: 54px; height: 54px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-amber);
          transition: transform 0.2s;
        }
        .person-avatar:hover { transform: scale(1.08); }

        .person-name-link { text-decoration: none; }
        .person-name { font-size: 1.15rem; color: white; font-weight: 700; transition: color 0.2s; }
        .person-name-link:hover .person-name { color: var(--primary-amber); }

        .person-location { display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; color: var(--text-muted); }
        .person-bio { color: var(--text-muted); font-size: 0.88rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .person-skills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .person-footer { margin-top: auto; padding-top: 0.5rem; }

        @media (max-width: 900px) {
          .filmmaker-grid { grid-template-columns: 1fr; }
          .search-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
