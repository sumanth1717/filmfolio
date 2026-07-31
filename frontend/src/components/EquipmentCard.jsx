import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag, Edit2, Trash2, Eye, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EquipmentCard({ item, onInquire, onDetail, onEdit, onDelete }) {
  const { user } = useAuth();
  const ownerId = item.user?._id || item.user;
  const isOwner = user && (ownerId === user._id || ownerId === user.id);

  return (
    <div className="card equipment-card-clean">
      {/* Top Image Banner */}
      <div className="equipment-image-container" onClick={() => onDetail && onDetail(item)}>
        <img
          src={item.image || 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=800'}
          alt={item.title}
          className="equipment-img"
        />

        {/* Top Badges */}
        <div className="top-badge-row">
          <span className="category-pill"><Tag size={11} /> {item.category}</span>
          <span className={`status-pill ${item.status === 'available' ? 'status-avail' : 'status-rented'}`}>
            {item.status === 'available' ? 'Available' : 'Rented'}
          </span>
        </div>

        {/* Bottom Price Tag */}
        <div className="price-tag-banner">
          <span className="price-num">₹{item.pricePerDay.toLocaleString('en-IN')}</span>
          <span className="price-unit">/ day</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="equipment-body">
        <h3 className="equipment-title-text" onClick={() => onDetail && onDetail(item)}>
          {item.title}
        </h3>

        <p className="equipment-desc-text">{item.description}</p>

        <div className="meta-info-row">
          <span className="location-item"><MapPin size={13} className="text-amber" /> {item.location}</span>
          {item.distanceMiles && <span className="distance-badge">📍 {item.distanceMiles} mi</span>}
        </div>

        {/* Owner Mini Bar */}
        <div className="owner-compact-bar">
          <Link to={`/profile/${ownerId}`}>
            <img
              src={item.user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={item.user?.name || 'Owner'}
              className="owner-avatar"
            />
          </Link>
          <div className="owner-meta">
            <Link to={`/profile/${ownerId}`} className="owner-name">
              <span>{item.user?.name || 'Filmmaker'}</span>
              <ShieldCheck size={12} className="text-emerald" />
            </Link>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="card-actions-row">
          {isOwner ? (
            <div className="owner-btn-row">
              <button onClick={() => onEdit(item)} className="btn btn-secondary btn-sm">
                <Edit2 size={13} /> Edit
              </button>
              <button onClick={() => onDelete(item._id)} className="btn btn-danger btn-sm">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          ) : (
            <div className="action-btn-group">
              <button onClick={() => onDetail && onDetail(item)} className="btn btn-secondary btn-sm flex-1">
                <Eye size={13} /> Specs
              </button>
              <button
                onClick={() => onInquire(item)}
                className="btn btn-cyan btn-sm flex-1"
                disabled={item.status === 'rented'}
              >
                <Zap size={13} /> {item.type === 'available_to_rent' ? 'Rent' : 'Offer'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .equipment-card-clean {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .equipment-card-clean:hover {
          transform: translateY(-3px);
          border-color: var(--primary-amber);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .equipment-image-container {
          position: relative;
          height: 175px;
          overflow: hidden;
          background: var(--bg-input);
          cursor: pointer;
        }

        .equipment-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .equipment-card-clean:hover .equipment-img {
          transform: scale(1.05);
        }

        .top-badge-row {
          position: absolute;
          top: 10px; left: 10px; right: 10px;
          display: flex; justify-content: space-between; align-items: center;
          z-index: 2;
        }

        .category-pill {
          background: rgba(11, 15, 23, 0.8);
          backdrop-filter: blur(6px);
          color: var(--primary-amber);
          border: 1px solid rgba(245, 158, 11, 0.4);
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .status-pill {
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          backdrop-filter: blur(6px);
        }

        .status-avail {
          background: rgba(16, 185, 129, 0.25);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .status-rented {
          background: rgba(148, 163, 184, 0.25);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }

        .price-tag-banner {
          position: absolute;
          bottom: 10px; left: 10px;
          background: rgba(11, 15, 23, 0.88);
          backdrop-filter: blur(8px);
          color: var(--primary-amber);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(245, 158, 11, 0.4);
          display: flex;
          align-items: baseline;
          gap: 2px;
          z-index: 2;
        }

        .price-num { font-weight: 800; font-size: 1.05rem; }
        .price-unit { color: #94a3b8; font-size: 0.72rem; }

        .equipment-body {
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          flex: 1;
        }

        .equipment-title-text {
          font-size: 1.05rem;
          color: var(--text-main);
          font-weight: 700;
          line-height: 1.3;
          cursor: pointer;
          transition: color 0.2s;
        }

        .equipment-title-text:hover { color: var(--primary-amber); }

        .equipment-desc-text {
          color: var(--text-muted);
          font-size: 0.85rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .meta-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .location-item { display: flex; align-items: center; gap: 0.25rem; }

        .distance-badge {
          background: rgba(6, 182, 212, 0.12);
          color: var(--cyan-glow);
          padding: 0.15rem 0.45rem;
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.72rem;
        }

        .owner-compact-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
        }

        .owner-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--primary-amber);
        }

        .owner-meta { font-size: 0.8rem; }

        .owner-name {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--text-main);
          font-weight: 600;
          text-decoration: none;
        }

        .owner-name:hover { color: var(--primary-amber); }

        .card-actions-row { margin-top: auto; padding-top: 0.4rem; }

        .action-btn-group { display: flex; gap: 0.5rem; width: 100%; }
        .flex-1 { flex: 1; }
        .owner-btn-row { display: flex; gap: 0.5rem; justify-content: flex-end; }
      `}</style>
    </div>
  );
}
