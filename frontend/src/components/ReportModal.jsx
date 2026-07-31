import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Send } from 'lucide-react';
import { reportItem, getErrorMessage } from '../services/api';

export default function ReportModal({ targetId, targetTitle, targetType = 'Listing', onClose, onSuccess }) {
  const [reason, setReason] = useState('Spam or Unsolicited Commercial Message');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reportReasons = [
    'Spam or Unsolicited Commercial Message',
    'Fraudulent Listing or Fake Equipment',
    'Inaccurate Location or Pricing Info',
    'Offensive, Discriminatory or Inappropriate Content',
    'Copyright or Identity Theft Violation',
    'Other Policy Concern'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await reportItem({
        id: targetId,
        type: targetType,
        reason,
        details
      });
      onSuccess('Report submitted to moderation team for review.');
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
          <div className="report-modal-title">
            <Flag size={20} className="text-amber" />
            <div>
              <h3>Report {targetType}</h3>
              <p className="subtitle">Regarding: <strong>{targetTitle}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close"><X size={18} /></button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Primary Reason for Report *</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} required>
              {reportReasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Additional Details (Optional)</label>
            <textarea
              rows={3}
              placeholder="Provide any additional context to assist our trust & safety moderation team..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-danger">
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }}></div> : <Send size={15} />}
              <span>Submit Moderation Report</span>
            </button>
          </div>
        </form>

        <style>{`
          .report-modal-title { display: flex; align-items: center; gap: 0.65rem; }
          .report-modal-title h3 { color: var(--text-main); font-size: 1.2rem; }
          .report-modal-title .subtitle { color: var(--text-muted); font-size: 0.85rem; }

          .report-form { display: flex; flex-direction: column; gap: 1.1rem; margin-top: 1rem; }
          .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
          .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
          .error-alert { background: rgba(244, 63, 94, 0.15); color: var(--rose-danger); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(244, 63, 94, 0.3); font-size: 0.85rem; }
          .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
        `}</style>
      </div>
    </div>
  );
}
