import React, { useState } from 'react';
import { X, Calendar, MapPin, ShieldCheck, DollarSign, Send, Tag, Award, Check, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EquipmentDetailModal({ item, onClose, onInquire }) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const totalPrice = item.pricePerDay * days;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-corner"><X size={20} /></button>

        <div className="detail-modal-grid">
          {/* Left Column: Image Preview */}
          <div className="detail-image-box">
            <img src={item.image} alt={item.title} className="detail-img-full" />
            <div className="category-pill-overlay">
              <span className="badge badge-amber"><Tag size={12} /> {item.category}</span>
              <span className="badge badge-slate">{item.type === 'available_to_rent' ? 'For Rent' : 'Wanted'}</span>
            </div>
          </div>

          {/* Right Column: Specifications & Booking Calculator */}
          <div className="detail-info-col">
            <h2 className="detail-title">{item.title}</h2>

            <div className="location-distance-row">
              <span className="meta-item"><MapPin size={14} className="text-amber" /> {item.location}</span>
              <span className="meta-item badge-distance">📍 ~{item.distanceMiles || 5} miles away</span>
            </div>

            <div className="price-header-box">
              <div className="daily-price">
                <span className="amount">₹{item.pricePerDay.toLocaleString('en-IN')}</span>
                <span className="period">/ day</span>
              </div>

              <span className={`status-badge ${item.status === 'available' ? 'badge-emerald' : 'badge-slate'}`}>
                {item.status === 'available' ? 'Available Now' : 'Currently Rented'}
              </span>
            </div>

            <div className="spec-section">
              <h4>Equipment Inclusions & Description</h4>
              <p className="spec-description">{item.description}</p>
            </div>

            {/* Price Calculator Section */}
            <div className="calculator-box">
              <h4 className="calc-title"><Calendar size={15} className="text-cyan" /> Calculate Rental Estimates</h4>
              <div className="calc-inputs">
                <div className="calc-group">
                  <label>Pickup Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="calc-group">
                  <label>Return Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="calc-total-row">
                <span>Estimated Duration: <strong>{days} day(s)</strong></span>
                <span className="total-price-text">Total: <strong>₹{totalPrice.toLocaleString('en-IN')} INR</strong></span>
              </div>
            </div>

            {/* Owner Trust Badge */}
            <div className="owner-card-mini">
              <img
                src={item.user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                alt={item.user?.name}
                className="owner-avatar-md"
              />
              <div className="owner-info">
                <strong>{item.user?.name || 'Verified Filmmaker'}</strong>
                <div className="trust-tags">
                  <span className="trust-item"><ShieldCheck size={13} className="text-emerald" /> Verified Identity</span>
                  <span className="trust-item"><Award size={13} className="text-amber" /> 100% Response Rate</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="detail-actions">
              <button
                onClick={() => {
                  onClose();
                  onInquire(item, { startDate, endDate, days, totalPrice });
                }}
                disabled={item.status === 'rented'}
                className="btn btn-cyan btn-lg full-width"
              >
                <Zap size={18} /> Request Rental (₹{totalPrice.toLocaleString('en-IN')} Total)
              </button>
            </div>
          </div>
        </div>

        <style>{`
          .detail-modal-content {
            max-width: 900px;
            padding: 0;
            overflow: hidden;
            position: relative;
          }

          .modal-close-corner {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(11, 15, 23, 0.7);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 10;
            border: 1px solid var(--border-color);
          }

          .detail-modal-grid {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
          }

          .detail-image-box {
            position: relative;
            background: #090d16;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .detail-img-full {
            width: 100%;
            height: 100%;
            max-height: 520px;
            object-fit: cover;
          }

          .category-pill-overlay {
            position: absolute;
            top: 16px;
            left: 16px;
            display: flex;
            gap: 0.5rem;
          }

          .detail-info-col {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1.1rem;
            max-height: 85vh;
            overflow-y: auto;
          }

          .detail-title {
            font-size: 1.5rem;
            color: white;
            line-height: 1.25;
          }

          .location-distance-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 0.88rem;
            color: var(--text-muted);
          }

          .badge-distance {
            background: rgba(6, 182, 212, 0.12);
            color: var(--cyan-glow);
            padding: 0.25rem 0.6rem;
            border-radius: 999px;
            font-weight: 600;
          }

          .price-header-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.03);
            padding: 0.85rem 1.2rem;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
          }

          .daily-price .amount {
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--primary-amber);
          }

          .daily-price .period {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-left: 0.25rem;
          }

          .spec-section h4 {
            color: white;
            font-size: 0.95rem;
            margin-bottom: 0.4rem;
          }

          .spec-description {
            color: var(--text-muted);
            font-size: 0.9rem;
            line-height: 1.5;
            white-space: pre-line;
          }

          .calculator-box {
            background: rgba(6, 182, 212, 0.05);
            border: 1px solid rgba(6, 182, 212, 0.2);
            padding: 1rem;
            border-radius: var(--radius-sm);
          }

          .calc-title {
            font-size: 0.9rem;
            color: white;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            margin-bottom: 0.75rem;
          }

          .calc-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .calc-group label {
            font-size: 0.75rem;
            color: var(--text-muted);
            display: block;
            margin-bottom: 0.25rem;
          }

          .calc-group input {
            padding: 0.4rem 0.6rem;
            font-size: 0.85rem;
          }

          .calc-total-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.88rem;
            color: var(--text-main);
            padding-top: 0.5rem;
            border-top: 1px dashed rgba(6, 182, 212, 0.3);
          }

          .total-price-text {
            color: var(--cyan-glow);
            font-size: 1rem;
          }

          .owner-card-mini {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.85rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
          }

          .owner-avatar-md {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            object-fit: cover;
          }

          .owner-info strong { color: white; display: block; font-size: 0.95rem; }

          .trust-tags {
            display: flex;
            gap: 0.75rem;
            font-size: 0.78rem;
            color: var(--text-muted);
            margin-top: 0.2rem;
          }

          .trust-item {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .text-emerald { color: var(--emerald-success); }

          @media (max-width: 800px) {
            .detail-modal-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    </div>
  );
}
