import React, { useState } from 'react';
import { X, Save, Upload, Briefcase, MapPin } from 'lucide-react';
import { updatePost, getErrorMessage } from '../services/api';
import { FILMMAKING_ROLES_BY_DEPARTMENT } from '../utils/rolesData';

export default function EditPostModal({ post, onClose, onSuccess }) {
  const [type, setType] = useState(post.type || 'crew_requirement');
  const [title, setTitle] = useState(post.title || '');
  const [selectedRole, setSelectedRole] = useState(post.roleNeeded || 'Director of Photography (DP/DOP)');
  const [customRole, setCustomRole] = useState('');
  const [location, setLocation] = useState(post.location || '');
  const [description, setDescription] = useState(post.description || '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const finalRole = selectedRole === 'Other / Custom Role' ? customRole : selectedRole;

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      await updatePost(post._id, formData);
      onSuccess('Post updated successfully');
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Feed Post</h3>
          <button onClick={onClose} className="btn-close"><X size={18} /></button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Post Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
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
                  placeholder="Specify custom role..."
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><Upload size={14} /> Change Cover Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }}></div> : <Save size={16} />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        <style>{`
          .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
          .modal-title { color: var(--text-main); font-size: 1.2rem; }
          .btn-close { background: none; color: var(--text-muted); }
          .post-form { display: flex; flex-direction: column; gap: 1rem; }
          .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
          .form-group label { color: var(--text-main); font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }
          .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
          .error-alert { background: rgba(244, 63, 94, 0.15); color: var(--rose-danger); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(244, 63, 94, 0.3); font-size: 0.85rem; }
          .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
        `}</style>
      </div>
    </div>
  );
}
