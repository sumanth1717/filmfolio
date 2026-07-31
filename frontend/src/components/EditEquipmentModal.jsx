import React, { useState } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { updateEquipment, getErrorMessage } from '../services/api';

export default function EditEquipmentModal({ item, onClose, onSuccess }) {
  const [title, setTitle] = useState(item.title || '');
  const [category, setCategory] = useState(item.category || 'Camera');
  const [type, setType] = useState(item.type || 'available_to_rent');
  const [pricePerDay, setPricePerDay] = useState(item.pricePerDay || 0);
  const [location, setLocation] = useState(item.location || '');
  const [status, setStatus] = useState(item.status || 'available');
  const [description, setDescription] = useState(item.description || '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('type', type);
      formData.append('pricePerDay', pricePerDay);
      formData.append('location', location);
      formData.append('status', status);
      formData.append('description', description);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await updateEquipment(item._id, formData);
      onSuccess('Equipment listing updated');
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
          <h3 className="modal-title">Edit Gear Listing</h3>
          <button onClick={onClose} className="btn-close"><X size={18} /></button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Equipment Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
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
              <label>Listing Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="available_to_rent">Available to Rent</option>
                <option value="looking_to_rent">Looking to Rent / Wanted</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($ / day)</label>
              <input
                type="number"
                min="0"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Rental Availability Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="available">Available</option>
                <option value="rented">Currently Rented</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="form-group">
            <label><ImageIcon size={14} /> Update Gear Photo (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }}></div> : <Save size={16} />}
              <span>Save Listing</span>
            </button>
          </div>
        </form>

        <style>{`
          .edit-form { display: flex; flex-direction: column; gap: 1rem; }
        `}</style>
      </div>
    </div>
  );
}
