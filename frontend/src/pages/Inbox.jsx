import React, { useState, useEffect } from 'react';
import { Inbox as InboxIcon, Mail, Phone, CheckCircle, XCircle, Clock, User, FileText, Calendar, DollarSign } from 'lucide-react';
import { getReceivedReplies, getSentReplies, updateReplyStatus, getErrorMessage } from '../services/api';
import Toast from '../components/Toast';
import RentalInvoiceModal from '../components/RentalInvoiceModal';

export default function Inbox() {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedReplies, setReceivedReplies] = useState([]);
  const [sentReplies, setSentReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Invoice Modal State
  const [selectedReplyForInvoice, setSelectedReplyForInvoice] = useState(null);

  const fetchInboxData = async () => {
    try {
      setLoading(true);
      setError('');
      const [recRes, sentRes] = await Promise.all([
        getReceivedReplies(),
        getSentReplies()
      ]);

      if (recRes.success) setReceivedReplies(recRes.replies || []);
      if (sentRes.success) setSentReplies(sentRes.replies || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInboxData();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateReplyStatus(id, newStatus);
      setToastMessage(`Inquiry marked as ${newStatus}`);
      setReceivedReplies((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      setToastMessage(getErrorMessage(err));
    }
  };

  const activeList = activeTab === 'received' ? receivedReplies : sentReplies;

  return (
    <div className="inbox-page">
      {toastMessage && (
        <Toast type="success" message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <InboxIcon size={28} className="text-amber" /> Responses & Inquiry Inbox
          </h1>
          <p className="page-subtitle">Review incoming applications, calculate rental subtotals, and download booking agreements.</p>
        </div>
      </div>

      <div className="tab-filters">
        <button
          className={`filter-tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received Inquiries ({receivedReplies.length})
        </button>

        <button
          className={`filter-tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent Responses ({sentReplies.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="spinner"></div>
          <p>Loading inbox messages...</p>
        </div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : activeList.length === 0 ? (
        <div className="empty-state card">
          <h3>No {activeTab} inquiries found</h3>
          <p>When other filmmakers respond to your posts or gear listings, their inquiries will appear here.</p>
        </div>
      ) : (
        <div className="inbox-list">
          {activeList.map((reply) => {
            const partner = activeTab === 'received' ? reply.sender : reply.receiver;
            return (
              <div key={reply._id} className="card reply-card">
                <div className="reply-top">
                  <div className="partner-profile">
                    <img
                      src={partner?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={partner?.name || 'Filmmaker'}
                      className="partner-avatar"
                    />
                    <div>
                      <h3 className="partner-name">{partner?.name || 'Filmmaker'}</h3>
                      <div className="reply-target-tag">
                        <span>Regarding <strong>{reply.targetType}</strong>: {reply.targetTitle}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      reply.status === 'accepted'
                        ? 'badge-emerald'
                        : reply.status === 'declined'
                        ? 'badge-slate'
                        : 'badge-amber'
                    }`}
                  >
                    {reply.status.toUpperCase()}
                  </span>
                </div>

                <div className="reply-body">
                  <p className="message-content">{reply.message}</p>

                  {/* Dates & Subtotal Metadata */}
                  {(reply.startDate || reply.totalPrice > 0) && (
                    <div className="rental-meta-banner">
                      {reply.startDate && (
                        <span><Calendar size={13} /> {reply.startDate} → {reply.endDate || 'TBD'} ({reply.rentalDays || 1} day)</span>
                      )}
                      {reply.totalPrice > 0 && (
                        <span className="price-tag-sm"><DollarSign size={13} /> Calculated Total: <strong>${reply.totalPrice} USD</strong></span>
                      )}
                    </div>
                  )}

                  <div className="contact-details-box">
                    <div className="contact-item">
                      <Mail size={14} className="text-amber" />
                      <span>{reply.contactEmail || partner?.email}</span>
                    </div>

                    {reply.contactPhone && (
                      <div className="contact-item">
                        <Phone size={14} className="text-cyan" />
                        <span>{reply.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="reply-actions">
                  {reply.status === 'accepted' && (
                    <button
                      onClick={() => setSelectedReplyForInvoice(reply)}
                      className="btn btn-secondary btn-sm"
                    >
                      <FileText size={14} className="text-amber" /> Download PDF Rental Agreement & Invoice
                    </button>
                  )}

                  {activeTab === 'received' && reply.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(reply._id, 'accepted')}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle size={14} /> Accept Inquiry
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(reply._id, 'declined')}
                        className="btn btn-secondary btn-sm"
                      >
                        <XCircle size={14} /> Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedReplyForInvoice && (
        <RentalInvoiceModal
          reply={selectedReplyForInvoice}
          onClose={() => setSelectedReplyForInvoice(null)}
        />
      )}

      <style>{`
        .inbox-page { display: flex; flex-direction: column; gap: 1.5rem; }

        .tab-filters { display: flex; gap: 0.5rem; }

        .filter-tab {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: var(--radius-sm);
        }

        .filter-tab.active {
          background: var(--primary-amber);
          color: #0b0f17;
          border-color: var(--primary-amber);
        }

        .inbox-list { display: flex; flex-direction: column; gap: 1rem; }
        .reply-card { display: flex; flex-direction: column; gap: 1rem; }

        .reply-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .partner-profile { display: flex; align-items: center; gap: 0.85rem; }

        .partner-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-color);
        }

        .partner-name { font-size: 1.1rem; color: white; font-weight: 700; }

        .reply-target-tag {
          font-size: 0.82rem;
          color: var(--cyan-glow);
          margin-top: 0.15rem;
        }

        .message-content {
          background: rgba(255, 255, 255, 0.03);
          padding: 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-main);
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
        }

        .rental-meta-banner {
          display: flex;
          justify-content: space-between;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.2);
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          color: white;
          margin-bottom: 0.75rem;
        }

        .price-tag-sm { color: var(--primary-amber); }

        .contact-details-box {
          display: flex;
          gap: 1.5rem;
          font-size: 0.85rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-muted);
        }

        .reply-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
