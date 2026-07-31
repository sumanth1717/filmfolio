import React, { useState } from 'react';
import { X, Send, Mail, Phone, MessageSquare, Calendar, AlertCircle } from 'lucide-react';
import { sendReply, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReplyModal({ target, targetType, onClose, onSuccess, initialData = {} }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [startDate, setStartDate] = useState(initialData.startDate || '');
  const [endDate, setEndDate] = useState(initialData.endDate || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateDays = () => {
    if (!startDate || !endDate) return initialData.days || 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const pricePerDay = targetType === 'Equipment' ? target.pricePerDay || 0 : 0;
  const totalPrice = pricePerDay * days;

  // Phone validation helper
  const handlePhoneChange = (e) => {
    const val = e.target.value;
    // Allow digits, spaces, plus sign, dashes, and parentheses
    const phoneRegex = /^[0-9+\-\s()]*$/;
    if (phoneRegex.test(val)) {
      setContactPhone(val);
      if (error && error.includes('phone number')) setError('');
    } else {
      setError('Phone number must contain numbers only (e.g. +91 98480 12345).');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write a message for your inquiry.');
      return;
    }

    if (contactPhone.trim()) {
      const digitsOnly = contactPhone.replace(/\D/g, '');
      if (digitsOnly.length < 7) {
        setError('Please enter a valid phone number with at least 7-10 digits.');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      await sendReply({
        targetType,
        targetId: target._id,
        message,
        contactEmail,
        contactPhone,
        startDate,
        endDate,
        rentalDays: days
      });
      onSuccess('Your inquiry and rental proposal have been submitted!');
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
          <div>
            <h3 className="modal-title">Send Response / Rental Inquiry</h3>
            <p className="modal-subtitle">Regarding: <strong>{target.title}</strong></p>
          </div>
          <button onClick={onClose} className="btn-close"><X size={18} /></button>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="reply-form">
          {targetType === 'Equipment' && (
            <div className="booking-picker-box">
              <h4 className="picker-title"><Calendar size={14} className="text-cyan" /> Request Shoot Dates</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Pickup Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Return Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {pricePerDay > 0 && (
                <div className="cost-summary-pill">
                  <span>Rate: ₹{pricePerDay.toLocaleString('en-IN')}/day &times; {days} day(s)</span>
                  <span className="total-badge">₹{totalPrice.toLocaleString('en-IN')} INR Total</span>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label><MessageSquare size={14} /> Message to {target.user?.name || 'Owner'}</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, detail your production timeline, insurance details, and pickup/return logistics..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><Mail size={14} /> Your Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label><Phone size={14} /> Contact Phone (Numbers Only)</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={handlePhoneChange}
                placeholder="+91 98480 12345"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-cyan">
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }}></div> : <Send size={16} />}
              <span>Submit Inquiry {totalPrice > 0 ? `(₹${totalPrice.toLocaleString('en-IN')})` : ''}</span>
            </button>
          </div>
        </form>

        <style>{`
          .modal-header {
            display: flex; justify-content: space-between; align-items: flex-start;
            margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color);
          }
          .modal-title { color: var(--text-main); font-size: 1.3rem; }
          .modal-subtitle { color: var(--text-muted); font-size: 0.85rem; }
          .btn-close { background: none; color: var(--text-muted); }
          .reply-form { display: flex; flex-direction: column; gap: 1.1rem; }

          .booking-picker-box {
            background: rgba(6, 182, 212, 0.06); border: 1px solid rgba(6, 182, 212, 0.2);
            padding: 0.85rem; border-radius: var(--radius-sm);
          }

          .picker-title { color: var(--text-main); font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.5rem; }

          .cost-summary-pill {
            display: flex; justify-content: space-between; align-items: center;
            font-size: 0.82rem; color: var(--text-muted); margin-top: 0.5rem;
            padding-top: 0.5rem; border-top: 1px dashed rgba(6, 182, 212, 0.3);
          }

          .total-badge { color: var(--cyan-glow); font-weight: 800; font-size: 0.95rem; }

          .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
          .form-group label { color: var(--text-main); font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }
          .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

          .error-alert {
            display: flex; align-items: center; gap: 0.5rem;
            background: rgba(244, 63, 94, 0.15); color: var(--rose-danger);
            padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(244, 63, 94, 0.3);
            font-size: 0.85rem; margin-bottom: 1rem;
          }

          .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
        `}</style>
      </div>
    </div>
  );
}
