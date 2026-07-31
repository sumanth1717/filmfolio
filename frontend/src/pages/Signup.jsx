import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User as UserIcon, MapPin, Film, Upload, AlertCircle, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCity, setSelectedCity] = useState('Vijayawada, Andhra Pradesh');
  const [customLocation, setCustomLocation] = useState('');
  const [geoStatus, setGeoStatus] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('Director, Cinematographer');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cityOptions = [
    'Vijayawada, Andhra Pradesh',
    'Guntur, Andhra Pradesh',
    'Mangalagiri, Andhra Pradesh',
    'Amaravati, Andhra Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Hyderabad, Telangana',
    'Other / Custom Location'
  ];

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }

    setGeoStatus('Detecting your GPS location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Accurate location detected
        const detected = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (Vijayawada Proximity)`;
        setSelectedCity('Other / Custom Location');
        setCustomLocation(`Vijayawada, AP (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        setGeoStatus('📍 GPS Location detected successfully!');
      },
      (err) => {
        setGeoStatus('Could not retrieve GPS location. Selected default city.');
      }
    );
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please fill in all required fields: Name, Email, and Password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    const finalLocation = selectedCity === 'Other / Custom Location' && customLocation.trim()
      ? customLocation
      : selectedCity;

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('location', finalLocation);
      formData.append('bio', bio);
      formData.append('skills', skills);

      if (profilePicFile) {
        formData.append('profilePicture', profilePicFile);
      }

      await signup(formData);
      navigate('/feed');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page signup-page">
      <div className="card auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Film size={26} className="text-amber" />
          </div>
          <h2>Join FilmFolio AP Network</h2>
          <p>Create your filmmaker profile in Vijayawada, Guntur & AP region.</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><UserIcon size={14} /> Full Name *</label>
            <input
              type="text"
              placeholder="e.g., S. S. Rajamouli"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><Mail size={14} /> Email Address *</label>
            <input
              type="email"
              placeholder="rajamouli@filmfolio.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={14} /> Password (min 6 chars) *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Location Selection & GPS Geolocation */}
          <div className="form-group">
            <div className="location-label-row">
              <label><MapPin size={14} /> Primary City / Region *</label>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="btn-gps-detect"
                title="Detect location using browser GPS"
              >
                <Navigation size={12} /> Auto-Detect GPS
              </button>
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {selectedCity === 'Other / Custom Location' && (
              <input
                type="text"
                placeholder="Enter your exact city/area (e.g. Benz Circle, Vijayawada)"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                style={{ marginTop: '0.5rem' }}
                required
              />
            )}

            {geoStatus && <p className="geo-status-text">{geoStatus}</p>}
          </div>

          <div className="form-group">
            <label>Filmmaking Skills (Comma Separated)</label>
            <input
              type="text"
              placeholder="Director, Cinematographer, Gaffer, Sound Mixer"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Short Bio</label>
            <textarea
              rows={2}
              placeholder="Brief summary of your background, filmography, or production gear setup..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label><Upload size={14} /> Profile Picture (Optional)</label>
            <input type="file" accept="image/*" onChange={handlePicChange} />
            {previewUrl && (
              <div className="avatar-preview-box">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg full-width">
            {loading ? <div className="spinner" style={{ width: 18, height: 18 }}></div> : <UserPlus size={18} />}
            <span>Complete Registration</span>
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="link-amber">Sign In</Link>
          </p>
        </div>
      </div>

      <style>{`
        .signup-page { max-width: 520px; }
        .auth-card { padding: 2.5rem 2rem; }
        .auth-header { text-align: center; margin-bottom: 1.5rem; }

        .auth-logo {
          width: 50px; height: 50px; border-radius: var(--radius-sm);
          background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
        }

        .auth-header h2 { color: white; font-size: 1.5rem; }
        .auth-header p { color: var(--text-muted); font-size: 0.88rem; margin-top: 0.25rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }

        .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
        .location-label-row { display: flex; justify-content: space-between; align-items: center; }

        .form-group label { color: white; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

        .btn-gps-detect {
          background: rgba(6, 182, 212, 0.15); color: var(--cyan-glow); border: 1px solid rgba(6, 182, 212, 0.3);
          font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm);
          display: flex; align-items: center; gap: 0.25rem; cursor: pointer;
        }
        .btn-gps-detect:hover { background: var(--cyan-glow); color: #0b0f17; }

        .geo-status-text { font-size: 0.78rem; color: var(--cyan-glow); margin-top: 0.25rem; }

        .avatar-preview-box { margin-top: 0.5rem; display: flex; align-items: center; }
        .avatar-preview-box img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-amber); }

        .error-alert {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(244, 63, 94, 0.15); color: var(--rose-danger);
          padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(244, 63, 94, 0.3);
          font-size: 0.85rem; margin-bottom: 1rem;
        }

        .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted); }
        .link-amber { color: var(--primary-amber); font-weight: 600; }
        .full-width { width: 100%; }
      `}</style>
    </div>
  );
}
