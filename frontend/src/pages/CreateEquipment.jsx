import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, ArrowLeft, DollarSign } from 'lucide-react';
import { createEquipment, getErrorMessage } from '../services/api';

export default function CreateEquipment() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Camera');
  const [type, setType] = useState('available_to_rent');
  const [pricePerDay, setPricePerDay] = useState('');
  const [location, setLocation] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || pricePerDay === '' || !location.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('type', type);
      formData.append('pricePerDay', pricePerDay);
      formData.append('location', location);
      formData.append('description', description);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createEquipment(formData);
      navigate('/marketplace');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-equipment-page">
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm back-btn">
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      <div className="card form-card">
        <div className="form-header">
          <h1 className="form-title">
            <PlusCircle size={24} className="text-amber" /> List Equipment for Rent
          </h1>
          <p className="form-subtitle">List your camera gear, lenses, audio equipment, or lighting packages to local filmmakers.</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="equipment-form">
          <div className="form-group">
            <label>Listing Category Purpose</label>
            <div className="radio-tile-group">
              <label className={`radio-tile ${type === 'available_to_rent' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="available_to_rent"
                  checked={type === 'available_to_rent'}
                  onChange={() => setType('available_to_rent')}
                />
                <div>
                  <strong>Available to Rent</strong>
                  <p>Offer gear you own for daily rental</p>
                </div>
              </label>

              <label className={`radio-tile ${type === 'looking_to_rent' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="looking_to_rent"
                  checked={type === 'looking_to_rent'}
                  onChange={() => setType('looking_to_rent')}
                />
                <div>
                  <strong>Looking to Rent (Wanted)</strong>
                  <p>Request specific gear from nearby owners</p>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Equipment Title *</label>
            <input
              type="text"
              placeholder="e.g., RED V-Raptor 8K Camera Body + V-Mount Battery Pack"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gear Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Camera">Camera</option>
                <option value="Lenses">Lenses</option>
                <option value="Lighting">Lighting</option>
                <option value="Audio">Audio</option>
                <option value="Grip & Rigging">Grip & Rigging</option>
                <option value="Drones">Drones</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Daily Rental Rate ($ USD) *</label>
              <div className="input-prefix-wrap">
                <DollarSign size={16} className="prefix-icon" />
                <input
                  type="number"
                  min="0"
                  placeholder="350"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Location / Pickup City *</label>
            <input
              type="text"
              placeholder="e.g., Los Angeles, CA or Brooklyn, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Full Specification & Package Inclusions *</label>
            <textarea
              rows={5}
              placeholder="List accessories included (media cards, batteries, cage, flight case, cables), rental terms, and insurance expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload High-Res Equipment Photo</label>
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
            <button type="button" onClick={() => navigate('/marketplace')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
              {loading ? <div className="spinner" style={{ width: 18, height: 18 }}></div> : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .create-equipment-page {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-card { padding: 2rem; }

        .form-title {
          font-size: 1.6rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-subtitle { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }

        .equipment-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .radio-tile-group { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .radio-tile {
          border: 1px solid var(--border-color);
          background: var(--bg-input);
          padding: 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .radio-tile input { display: none; }

        .radio-tile.selected {
          border-color: var(--primary-amber);
          background: rgba(245, 158, 11, 0.08);
        }

        .radio-tile strong { color: white; display: block; font-size: 0.95rem; }
        .radio-tile p { color: var(--text-muted); font-size: 0.8rem; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .input-prefix-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .prefix-icon {
          position: absolute;
          left: 12px;
          color: var(--primary-amber);
        }

        .input-prefix-wrap input { padding-left: 2.2rem; }

        .file-upload-box {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          text-align: center;
          position: relative;
          background: var(--bg-input);
        }

        .file-upload-box input[type='file'] {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;
        }

        .file-upload-box p { color: var(--text-muted); font-size: 0.85rem; margin-top: 0.5rem; }

        .image-preview { margin-top: 0.75rem; border-radius: var(--radius-sm); overflow: hidden; max-height: 250px; }
        .image-preview img { width: 100%; object-fit: cover; }

        .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
      `}</style>
    </div>
  );
}
