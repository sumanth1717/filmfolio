import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Briefcase, MessageSquare, Edit2, Trash2, Share2, Bookmark, Check, Flag, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReportModal from './ReportModal';

export default function PostCard({ post, onReply, onEdit, onDelete, isFollowed = false }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState('');

  const postUserId = post.user?._id || post.user;
  const isOwner = user && (postUserId === user._id || postUserId === user.id);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleShare = () => {
    const url = `${window.location.origin}/feed?postId=${post._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`card post-card ${isFollowed ? 'post-followed-border' : ''}`}>
      <div className="post-header">
        <div className="author-info">
          <Link to={`/profile/${postUserId}`}>
            <img
              src={post.user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={post.user?.name || 'Filmmaker'}
              className="author-avatar"
            />
          </Link>
          <div>
            <div className="author-name-row">
              <Link to={`/profile/${postUserId}`} className="author-name-link">
                <h4 className="author-name">{post.user?.name || 'Anonymous Filmmaker'}</h4>
              </Link>
              {isFollowed && (
                <span className="badge-followed">
                  <UserCheck size={11} /> Followed Creator
                </span>
              )}
            </div>
            <div className="post-meta">
              <span className="meta-item"><MapPin size={13} /> {post.location}</span>
              <span className="meta-item"><Calendar size={13} /> {formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="header-badges-row">
          <span className={`badge ${post.type === 'crew_requirement' ? 'badge-amber' : 'badge-cyan'}`}>
            {post.type === 'crew_requirement' ? 'Crew Callout' : 'Services Offered'}
          </span>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`btn-icon-action ${bookmarked ? 'active-bookmark' : ''}`}
            title={bookmarked ? 'Remove Bookmark' : 'Bookmark Post'}
          >
            <Bookmark size={15} />
          </button>
        </div>
      </div>

      <div className="post-body">
        <h3 className="post-title">{post.title}</h3>
        <div className="role-tag">
          <Briefcase size={14} />
          <span>Role: <strong>{post.roleNeeded}</strong></span>
        </div>

        <p className="post-description">{post.description}</p>

        {post.image && (
          <div className="post-image-wrap">
            <img src={post.image} alt={post.title} className="post-image" />
          </div>
        )}
      </div>

      <div className="post-footer">
        <div className="footer-left-btns">
          <button onClick={handleShare} className="btn btn-secondary btn-sm" title="Share / Copy Link">
            {copied ? <Check size={14} className="text-emerald" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
          {!isOwner && (
            <button onClick={() => setShowReportModal(true)} className="btn-report-text" title="Report Post">
              <Flag size={13} /> Report
            </button>
          )}
        </div>

        {isOwner ? (
          <div className="owner-actions">
            <button onClick={() => onEdit(post)} className="btn btn-secondary btn-sm">
              <Edit2 size={14} /> Edit
            </button>
            <button onClick={() => onDelete(post._id)} className="btn btn-danger btn-sm">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ) : (
          <button onClick={() => onReply(post)} className="btn btn-primary btn-sm">
            <MessageSquare size={14} /> Apply / Respond
          </button>
        )}
      </div>

      {showReportModal && (
        <ReportModal
          targetId={post._id}
          targetTitle={post.title}
          targetType="Post"
          onClose={() => setShowReportModal(false)}
          onSuccess={(msg) => alert(msg)}
        />
      )}

      <style>{`
        .post-card { display: flex; flex-direction: column; gap: 1rem; }

        .post-followed-border {
          border-color: rgba(245, 158, 11, 0.4) !important;
          box-shadow: 0 4px 18px rgba(245, 158, 11, 0.12);
        }

        .post-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
        .author-info { display: flex; align-items: center; gap: 0.75rem; }

        .author-avatar {
          width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);
          transition: transform 0.2s;
        }
        .author-avatar:hover { transform: scale(1.08); border-color: var(--primary-amber); }

        .author-name-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .author-name-link { text-decoration: none; }
        .author-name { font-size: 1.05rem; color: var(--text-main); font-weight: 600; transition: color 0.2s; }
        .author-name-link:hover .author-name { color: var(--primary-amber); }

        .badge-followed {
          background: rgba(245, 158, 11, 0.15); color: var(--primary-amber);
          border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.7rem; font-weight: 700;
          padding: 0.15rem 0.45rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.2rem;
        }

        .post-meta { display: flex; gap: 0.85rem; font-size: 0.8rem; color: var(--text-muted); }
        .meta-item { display: flex; align-items: center; gap: 0.25rem; }

        .header-badges-row { display: flex; align-items: center; gap: 0.5rem; }

        .btn-icon-action {
          background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid var(--border-color);
          padding: 0.35rem; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .btn-icon-action:hover, .active-bookmark { color: var(--primary-amber); border-color: var(--primary-amber); background: rgba(245, 158, 11, 0.15); }

        .post-title { font-size: 1.2rem; color: var(--text-main); margin-bottom: 0.5rem; font-weight: 700; }
        .role-tag {
          display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(255, 255, 255, 0.05);
          padding: 0.3rem 0.65rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--cyan-glow);
          margin-bottom: 0.75rem; border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .post-description { color: var(--text-muted); font-size: 0.95rem; white-space: pre-line; }
        .post-image-wrap { margin-top: 1rem; border-radius: var(--radius-sm); overflow: hidden; max-height: 350px; border: 1px solid var(--border-color); }
        .post-image { width: 100%; height: 100%; object-fit: cover; display: block; }

        .post-footer { margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        .footer-left-btns { display: flex; align-items: center; gap: 0.6rem; }
        .btn-report-text { background: none; color: var(--text-muted); font-size: 0.78rem; display: flex; align-items: center; gap: 0.25rem; }
        .btn-report-text:hover { color: var(--rose-danger); }
        .owner-actions { display: flex; gap: 0.5rem; }
      `}</style>
    </div>
  );
}
