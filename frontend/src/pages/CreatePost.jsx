import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, ArrowLeft, Briefcase, MapPin } from 'lucide-react';
import { createPost, getErrorMessage } from '../services/api';
import { FILMMAKING_ROLES_BY_DEPARTMENT } from '../utils/rolesData';

export default function CreatePost() {
  const navigate = useNavigate();

  const [type, setType] = useState('crew_requirement');
  const [title, setTitle] = useState('');
  const [selectedRole, setSelectedRole] = useState('Director of Photography (DP/DOP)');
  const [customRole, setCustomRole] = useState('');
  const [location, setLocation] = useState('Vijayawada, AP');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const finalRole = selectedRole === 'Other / Custom Role' ? customRole : selectedRole;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !finalRole.trim()) {
      setError('Please fill in all required fields: Title, Role, and Description.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title);
      formData.append('roleNeeded', finalRole);
      formData.append('location', location);
      formData.append('description', description);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createPost(formData);
      navigate('/feed');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm back-btn">
        <ArrowLeft size={16} /> Back to Feed
      </button>

      <div className="card form-card">
        <div className="form-header">
          <h1 className="form-title">
            <PlusCircle size={24} className="text-amber" /> Create Feed Post
          </h1>
          <p className="form-subtitle">Publish a crew requirement callout or offer your filmmaking services.</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Post Purpose</label>
            <div className="radio-tile-group">
              <label className={`radio-tile ${type === 'crew_requirement' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="crew_requirement"
                  checked={type === 'crew_requirement'}
                  onChange={() => setType('crew_requirement')}
                />
                <div>
                  <strong>Crew / Cast Callout</strong>
                  <p>Hiring crew or talent for a film shoot</p>
                </div>
              </label>

              <label className={`radio-tile ${type === 'hiring_my_work' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="hiring_my_work"
                  checked={type === 'hiring_my_work'}
                  onChange={() => setType('hiring_my_work')}
                />
                <div>
                  <strong>Services Offered</strong>
                  <p>Pitching your own work or technical availability</p>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Post Title *</label>
            <input
              type="text"
              placeholder="e.g., Seeking Experienced Gaffer for 3-Day Action Short Shoot in Vijayawada"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            {/* Categorized Role Dropdown */}
            <div className="form-group">
              <label><Briefcase size={14} className="text-amber" /> Role Needed / Offered *</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              >
                {FILMMAKING_ROLES_BY_DEPARTMENT.map((dept) => (
                  <optgroup key={dept.department} label={`── ${dept.department.toUpperCase()} ──`}>
                    {dept.roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </optgroup>
                ))}
                <option value="Other / Custom Role">Other / Custom Role</option>
              </select>

              {selectedRole === 'Other / Custom Role' && (
                <input
                  type="text"
                  placeholder="Specify custom role name..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  style={{ marginTop: '0.5rem' }}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label><MapPin size={14} className="text-cyan" /> Location *</label>
              <input
                type="text"
                placeholder="e.g., Vijayawada, Guntur, AP or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Project Details & Requirements *</label>
            <textarea
              rows={5}
              placeholder="Provide shoot dates, compensation structure, storyline synopsis, gear expectations, or reel requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Attach Project Moodboard / Reference Image (Optional)</label>
            <div className="file-upload-box">
              <Upload size={24} className="text-amber" />
              <p>Click to select image file (JPG, PNG, WEBP)</p>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Upload preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/feed')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
              {loading ? <div className="spinner" style={{ width: 18, height: 18 }}></div> : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .create-post-page { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
        .form-card { padding: 2rem; }
        .form-header { margin-bottom: 1.5rem; }
        .form-title { font-size: 1.6rem; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem; }
        .form-subtitle { color: var(--text-muted); font-size: 0.9rem; }
        .post-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .radio-tile-group { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .radio-tile {
          border: 1px solid var(--border-color); background: var(--bg-input); padding: 1rem;
          border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s;
        }
        .radio-tile input { display: none; }
        .radio-tile.selected { border-color: var(--primary-amber); background: rgba(245, 158, 11, 0.08); }
        .radio-tile strong { color: var(--text-main); font-size: 0.95rem; display: block; }
        .radio-tile p { color: var(--text-muted); font-size: 0.8rem; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .file-upload-box {
          border: 2px dashed var(--border-color); border-radius: var(--radius-sm); padding: 1.5rem;
          text-align: center; position: relative; cursor: pointer; background: var(--bg-input);
        }
        .file-upload-box input[type='file'] { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        .file-upload-box p { color: var(--text-muted); font-size: 0.85rem; margin-top: 0.5rem; }

        .image-preview { margin-top: 0.75rem; border-radius: var(--radius-sm); overflow: hidden; max-height: 250px; }
        .image-preview img { width: 100%; object-fit: cover; }

        .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
        .error-alert {
          background: rgba(244, 63, 94, 0.15); color: var(--rose-danger);
          padding: 0.8rem 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(244, 63, 94, 0.3);
          font-size: 0.9rem; margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
