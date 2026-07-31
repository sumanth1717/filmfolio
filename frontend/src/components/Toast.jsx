import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ type = 'success', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast-banner toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>
      <div className="toast-message">{message}</div>
      {onClose && (
        <button onClick={onClose} className="toast-close">
          <X size={14} />
        </button>
      )}

      <style>{`
        .toast-banner {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-sm);
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          z-index: 2000;
          font-weight: 500;
          font-size: 0.9rem;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 420px;
        }

        .toast-success {
          background: #064e3b;
          color: #a7f3d0;
          border: 1px solid #059669;
        }

        .toast-error {
          background: #4c0519;
          color: #fecdd3;
          border: 1px solid #e11d48;
        }

        .toast-close {
          background: none;
          color: inherit;
          margin-left: auto;
          opacity: 0.7;
        }
        .toast-close:hover { opacity: 1; }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
