import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Search, Filter, PlusCircle, AlertCircle, MapPin, Briefcase, RefreshCw, X, UserCheck } from 'lucide-react';
import { getPosts, deletePost, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FILMMAKING_ROLES_BY_DEPARTMENT } from '../utils/rolesData';
import PostCard from '../components/PostCard';
import ReplyModal from '../components/ReplyModal';
import EditPostModal from '../components/EditPostModal';
import Toast from '../components/Toast';

export default function Feed() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Interactive Filters state
  const [activeType, setActiveType] = useState('all');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedOnly, setFollowedOnly] = useState(false);

  // Modals
  const [selectedPostForReply, setSelectedPostForReply] = useState(null);
  const [selectedPostForEdit, setSelectedPostForEdit] = useState(null);

  const cityOptions = ['All', 'Vijayawada', 'Guntur', 'Mangalagiri', 'Amaravati', 'Visakhapatnam (Vizag)', 'Hyderabad'];
  const userFollowing = user?.following || [];

  const getAuthorId = (u) => {
    if (!u) return '';
    if (typeof u === 'object') return (u._id || u.id || '').toString();
    return u.toString();
  };

  const fetchFeedPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const locFilter = selectedCity !== 'All' ? selectedCity : '';
      const roleFilter = selectedRole !== 'All' ? selectedRole : '';

      const data = await getPosts({
        type: activeType,
        location: locFilter,
        search: searchQuery || roleFilter
      });

      if (data && data.success) {
        let items = data.posts || [];

        // Apply role filter if selected
        if (selectedRole !== 'All') {
          items = items.filter((p) =>
            p.roleNeeded && typeof p.roleNeeded === 'string' && p.roleNeeded.toLowerCase().includes(selectedRole.toLowerCase())
          );
        }

        // Apply Followed Only filter
        if (followedOnly) {
          items = items.filter((p) => {
            const authorId = getAuthorId(p.user);
            return authorId && userFollowing.includes(authorId);
          });
        }

        // Sort posts so that posts from followed creators appear FIRST!
        items.sort((a, b) => {
          const authorA = getAuthorId(a.user);
          const authorB = getAuthorId(b.user);
          const isAFollowed = authorA && userFollowing.includes(authorA) ? 1 : 0;
          const isBFollowed = authorB && userFollowing.includes(authorB) ? 1 : 0;
          return isBFollowed - isAFollowed;
        });

        setPosts(items);
      }
    } catch (err) {
      console.error('[Feed Error]:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedPosts();
    }, 200);

    return () => clearTimeout(timer);
  }, [activeType, selectedRole, selectedCity, searchQuery, followedOnly, user]);

  const handleResetFilters = () => {
    setActiveType('all');
    setSelectedRole('All');
    setSelectedCity('All');
    setSearchQuery('');
    setFollowedOnly(false);
  };

  const handleReplyClick = (post) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedPostForReply(post);
  };

  const handleEditClick = (post) => {
    setSelectedPostForEdit(post);
  };

  const handleDeleteClick = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      setToastMessage('Post deleted successfully');
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      setToastMessage(getErrorMessage(err));
    }
  };

  const hasActiveFilters =
    activeType !== 'all' ||
    selectedRole !== 'All' ||
    selectedCity !== 'All' ||
    searchQuery !== '' ||
    followedOnly;

  return (
    <div className="feed-page">
      {toastMessage && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}

      {/* Header Bar */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Compass size={28} className="text-amber" /> Filmmaker Crew & Project Feed
          </h1>
          <p className="page-subtitle">Find directors, DPs, sound designers, foley artists, editors & crew in Vijayawada, Guntur & AP region.</p>
        </div>

        {isAuthenticated && (
          <Link to="/posts/new" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Create Feed Post</span>
          </Link>
        )}
      </div>

      {/* Interactive Filter Control Panel */}
      <div className="card filter-panel">
        <div className="filter-panel-top">
          <div className="tab-filters">
            <button
              className={`filter-tab ${activeType === 'all' ? 'active' : ''}`}
              onClick={() => setActiveType('all')}
            >
              All Feed Posts
            </button>
            <button
              className={`filter-tab ${activeType === 'crew_requirement' ? 'active' : ''}`}
              onClick={() => setActiveType('crew_requirement')}
            >
              Crew Callouts (Hiring)
            </button>
            <button
              className={`filter-tab ${activeType === 'hiring_my_work' ? 'active' : ''}`}
              onClick={() => setActiveType('hiring_my_work')}
            >
              Services Offered (Pitching)
            </button>
            {isAuthenticated && (
              <button
                className={`filter-tab ${followedOnly ? 'active-followed-tab' : ''}`}
                onClick={() => setFollowedOnly(!followedOnly)}
              >
                <UserCheck size={14} /> Followed Creators
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button onClick={handleResetFilters} className="btn-reset-text">
              <RefreshCw size={13} /> Reset Filters
            </button>
          )}
        </div>

        <div className="filter-controls-grid">
          {/* Department Categorized Role Selection Dropdown */}
          <div className="filter-item">
            <label><Briefcase size={14} className="text-amber" /> Filter by Specific Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="role-dropdown-select"
            >
              <option value="All">All Filmmaker Roles & Departments</option>
              {FILMMAKING_ROLES_BY_DEPARTMENT.map((dept) => (
                <optgroup key={dept.department} label={`── ${dept.department.toUpperCase()} ──`}>
                  {dept.roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* City / Location Dropdown */}
          <div className="filter-item">
            <label><MapPin size={14} className="text-cyan" /> Location / City</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city === 'All' ? 'All Cities (Vijayawada & Guntur Region)' : city}</option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div className="filter-item search-item">
            <label><Search size={14} className="text-amber" /> Keyword Search</label>
            <div className="search-input-wrap">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search Foley artist, Dubbing, Editor, Alexa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search"><X size={14} /></button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="active-pills-row">
            <span className="pills-label">Active Filters:</span>
            {followedOnly && (
              <span className="active-pill">
                Followed Creators Only
                <button onClick={() => setFollowedOnly(false)}><X size={12} /></button>
              </span>
            )}
            {activeType !== 'all' && (
              <span className="active-pill">
                Type: {activeType === 'crew_requirement' ? 'Crew Callouts' : 'Services Offered'}
                <button onClick={() => setActiveType('all')}><X size={12} /></button>
              </span>
            )}
            {selectedRole !== 'All' && (
              <span className="active-pill">
                Role: {selectedRole}
                <button onClick={() => setSelectedRole('All')}><X size={12} /></button>
              </span>
            )}
            {selectedCity !== 'All' && (
              <span className="active-pill">
                City: {selectedCity}
                <button onClick={() => setSelectedCity('All')}><X size={12} /></button>
              </span>
            )}
            {searchQuery && (
              <span className="active-pill">
                Keyword: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}><X size={12} /></button>
              </span>
            )}
            <button onClick={handleResetFilters} className="clear-all-pill">Clear All</button>
          </div>
        )}
      </div>

      {/* Main Listing Grid */}
      {loading ? (
        <div className="loading-center">
          <div className="spinner"></div>
          <p>Filtering production feed...</p>
        </div>
      ) : error ? (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state card">
          <h3>No feed posts match your filter criteria</h3>
          <p>Try selecting a different role or resetting your filters.</p>
          <button onClick={handleResetFilters} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="feed-grid">
          {posts.map((post) => {
            const authorId = getAuthorId(post.user);
            const isFollowed = authorId && userFollowing.includes(authorId);
            return (
              <PostCard
                key={post._id}
                post={post}
                isFollowed={isFollowed}
                onReply={handleReplyClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      {selectedPostForReply && (
        <ReplyModal
          target={selectedPostForReply}
          targetType="Post"
          onClose={() => setSelectedPostForReply(null)}
          onSuccess={(msg) => setToastMessage(msg)}
        />
      )}

      {/* Edit Modal */}
      {selectedPostForEdit && (
        <EditPostModal
          post={selectedPostForEdit}
          onClose={() => setSelectedPostForEdit(null)}
          onSuccess={(msg) => {
            setToastMessage(msg);
            fetchFeedPosts();
          }}
        />
      )}

      <style>{`
        .feed-page { display: flex; flex-direction: column; gap: 1.5rem; }

        .page-header {
          display: flex; justify-content: space-between; align-items: center; gap: 1rem;
          padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);
        }

        .page-title { font-size: 1.8rem; color: var(--text-main); display: flex; align-items: center; gap: 0.6rem; }
        .page-subtitle { color: var(--text-muted); font-size: 0.95rem; }

        .filter-panel {
          padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem;
          background: var(--bg-card); border: 1px solid var(--border-color);
        }

        .filter-panel-top {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;
        }

        .tab-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }

        .filter-tab {
          background: none; color: var(--text-muted); padding: 0.45rem 0.95rem;
          border-radius: var(--radius-sm); font-weight: 600; font-size: 0.88rem; transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 0.35rem;
        }

        .filter-tab.active { background: var(--primary-amber); color: #ffffff; font-weight: 700; }

        .active-followed-tab {
          background: rgba(245, 158, 11, 0.18); color: var(--primary-amber); border: 1px solid var(--primary-amber); font-weight: 700;
        }

        .btn-reset-text {
          background: none; color: var(--primary-amber); font-size: 0.82rem; font-weight: 600;
          display: flex; align-items: center; gap: 0.3rem;
        }

        .filter-controls-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 1rem; }
        .filter-item { display: flex; flex-direction: column; gap: 0.35rem; }
        .filter-item label { font-size: 0.82rem; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem; }

        .role-dropdown-select optgroup { font-weight: 800; color: var(--primary-amber); background: var(--bg-card); }

        .search-input-wrap { position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 12px; color: var(--text-muted); }
        .search-input-wrap input { padding-left: 2.2rem; padding-right: 2rem; }
        .clear-search { position: absolute; right: 10px; background: none; color: var(--text-muted); display: flex; align-items: center; }

        .active-pills-row {
          display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
          padding-top: 0.5rem; border-top: 1px dashed var(--border-color);
        }

        .pills-label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }

        .active-pill {
          display: inline-flex; align-items: center; gap: 0.35rem; background: rgba(245, 158, 11, 0.15);
          color: var(--primary-amber); border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600;
        }

        .active-pill button { background: none; color: inherit; display: flex; align-items: center; }
        .clear-all-pill { background: none; color: var(--rose-danger); font-size: 0.78rem; font-weight: 600; margin-left: auto; }

        .feed-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .empty-state { text-align: center; padding: 4rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color); color: var(--text-muted); }

        .error-banner {
          display: flex; align-items: center; gap: 0.5rem; background: rgba(244, 63, 94, 0.15);
          color: var(--rose-danger); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(244, 63, 94, 0.3);
        }

        @media (max-width: 900px) {
          .feed-grid { grid-template-columns: 1fr; }
          .filter-controls-grid { grid-template-columns: 1fr; }
          .filter-panel-top { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
}
