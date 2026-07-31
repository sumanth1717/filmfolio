import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPosts, getEquipment, getUserById, deletePost, deleteEquipment, toggleFollowUser, toggleBlockUser, getErrorMessage } from '../services/api';
import { User as UserIcon, MapPin, Briefcase, Camera, Compass, Edit3, X, Save, Image as ImageIcon, Mail, UserPlus, UserCheck, ShieldAlert, Flag } from 'lucide-react';
import PostCard from '../components/PostCard';
import EquipmentCard from '../components/EquipmentCard';
import EditPostModal from '../components/EditPostModal';
import EditEquipmentModal from '../components/EditEquipmentModal';
import Toast from '../components/Toast';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUserProfile, updateUserFollowing, updateUserBlocked } = useAuth();

  const isOwnProfile = !id || (currentUser && (id === currentUser._id || id === currentUser.id));

  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [userPosts, setUserPosts] = useState([]);
  const [userEquipment, setUserEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Follow & Block State
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Edit Profile Modal State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Edit Item Modals
  const [editingPost, setEditingPost] = useState(null);
  const [editingEquip, setEditingEquip] = useState(null);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      let targetUser = null;
      let targetUserId = null;

      if (isOwnProfile) {
        targetUser = currentUser;
        targetUserId = currentUser?._id;
      } else {
        const res = await getUserById(id);
        if (res.success) {
          targetUser = res.user;
          targetUserId = res.user._id;
        }
      }

      setProfileUser(targetUser);

      if (currentUser && targetUserId && !isOwnProfile) {
        const myFollowing = currentUser.following || [];
        const myBlocked = currentUser.blockedUsers || [];
        setIsFollowing(myFollowing.includes(targetUserId));
        setIsBlocked(myBlocked.includes(targetUserId));
      }

      if (targetUserId) {
        const [postsRes, equipRes] = await Promise.all([
          getPosts({ userId: targetUserId }),
          getEquipment({ userId: targetUserId })
        ]);

        if (postsRes.success) setUserPosts(postsRes.posts || []);
        if (equipRes.success) setUserEquipment(equipRes.equipment || []);
      }
    } catch (err) {
      setToastMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id, currentUser]);

  useEffect(() => {
    if (isOwnProfile && currentUser) {
      setEditName(currentUser.name || '');
      setEditBio(currentUser.bio || '');
      setEditLocation(currentUser.location || '');
      setEditSkills(currentUser.skills ? currentUser.skills.join(', ') : '');
    }
  }, [currentUser, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      const res = await toggleFollowUser(profileUser._id);
      setIsFollowing(res.isFollowing);
      if (res.following) {
        updateUserFollowing(res.following);
      }
      setToastMessage(res.message);
    } catch (err) {
      setToastMessage(getErrorMessage(err));
    }
  };

  const handleBlockToggle = async () => {
    if (!currentUser) return;
    if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} ${profileUser.name}?`)) return;
    try {
      const res = await toggleBlockUser(profileUser._id);
      setIsBlocked(res.isBlocked);
      if (res.blockedUsers) {
        updateUserBlocked(res.blockedUsers);
      }
      setToastMessage(res.message);
    } catch (err) {
      setToastMessage(getErrorMessage(err));
    }
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('bio', editBio);
      formData.append('location', editLocation);
      formData.append('skills', editSkills);

      if (profilePicFile) {
        formData.append('profilePicture', profilePicFile);
      }

      await updateUserProfile(formData);
      setToastMessage('Profile updated successfully');
      setShowEditProfileModal(false);
      fetchProfileData();
    } catch (err) {
      setToastMessage(getErrorMessage(err));
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(postId);
      setUserPosts(userPosts.filter((p) => p._id !== postId));
      setToastMessage('Post deleted');
    } catch (err) {
      setToastMessage(getErrorMessage(err));
    }
  };

  const handleDeleteEquip = async (equipId) => {
    if (!window.confirm('Delete this equipment listing?')) return;
    try {
      await deleteEquipment(equipId);
      setUserEquipment(userEquipment.filter((e) => e._id !== equipId));
      setToastMessage('Listing deleted');
    } catch (err) {
      setToastMessage(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
        <p>Loading filmmaker profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="empty-state card">
        <h3>User Profile Not Found</h3>
        <p>The requested filmmaker profile could not be retrieved.</p>
        <Link to="/directory" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
          Back to Directory
        </Link>
      </div>
    );
  }

  const availableGear = userEquipment.filter((e) => e.status === 'available');
  const followingCount = profileUser.following ? profileUser.following.length : 0;

  return (
    <div className="profile-page">
      {toastMessage && (
        <Toast type="success" message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* Header Banner */}
      <div className="card profile-header-card">
        <div className="profile-top-row">
          <div className="avatar-section">
            <img
              src={profileUser.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={profileUser.name}
              className="profile-avatar-lg"
            />
            <div>
              <h1 className="user-fullname">{profileUser.name}</h1>
              <div className="profile-location">
                <MapPin size={14} className="text-amber" />
                <span>{profileUser.location || 'Vijayawada, Andhra Pradesh'}</span>
              </div>
              <div className="profile-stats-mini">
                <span><strong>{userPosts.length}</strong> Posts</span>
                <span>•</span>
                <span><strong>{userEquipment.length}</strong> Listings</span>
                <span>•</span>
                <span><strong>{followingCount}</strong> Following</span>
              </div>
            </div>
          </div>

          {isOwnProfile ? (
            <button onClick={() => setShowEditProfileModal(true)} className="btn btn-secondary btn-sm">
              <Edit3 size={15} /> Edit Profile
            </button>
          ) : (
            <div className="profile-action-btns">
              <button
                onClick={handleFollowToggle}
                className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isFollowing ? <UserCheck size={15} /> : <UserPlus size={15} />}
                <span>{isFollowing ? 'Following' : 'Follow Filmmaker'}</span>
              </button>

              <a href={`mailto:${profileUser.email}`} className="btn btn-cyan btn-sm">
                <Mail size={15} /> Contact
              </a>

              <button
                onClick={handleBlockToggle}
                className="btn btn-danger btn-sm"
                title={isBlocked ? 'Unblock user' : 'Block user'}
              >
                <ShieldAlert size={15} />
              </button>
            </div>
          )}
        </div>

        <p className="profile-bio-text">{profileUser.bio || 'Professional filmmaker on FilmFolio network.'}</p>

        <div className="skills-row">
          {profileUser.skills && profileUser.skills.map((skill, index) => (
            <span key={index} className="badge badge-amber">{skill}</span>
          ))}
        </div>
      </div>

      {/* 3 Section Tabs */}
      <div className="profile-tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <Compass size={16} /> Feed Posts ({userPosts.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          <Camera size={16} /> Marketplace Gear ({userEquipment.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'rentable' ? 'active' : ''}`}
          onClick={() => setActiveTab('rentable')}
        >
          <Briefcase size={16} /> Gear Available for Rent ({availableGear.length})
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'feed' ? (
        userPosts.length === 0 ? (
          <div className="empty-state card">
            <h3>No feed posts published yet</h3>
            <p>This user hasn't posted any crew callouts or service offerings yet.</p>
          </div>
        ) : (
          <div className="feed-grid">
            {userPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onEdit={(p) => setEditingPost(p)}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )
      ) : activeTab === 'marketplace' ? (
        userEquipment.length === 0 ? (
          <div className="empty-state card">
            <h3>No marketplace gear listed yet</h3>
            <p>This user hasn't listed any equipment packages for rent yet.</p>
          </div>
        ) : (
          <div className="equipment-grid">
            {userEquipment.map((item) => (
              <EquipmentCard
                key={item._id}
                item={item}
                onEdit={(i) => setEditingEquip(i)}
                onDelete={handleDeleteEquip}
              />
            ))}
          </div>
        )
      ) : (
        availableGear.length === 0 ? (
          <div className="empty-state card">
            <h3>No gear currently available for rent</h3>
            <p>No gear active for rental.</p>
          </div>
        ) : (
          <div className="equipment-grid">
            {availableGear.map((item) => (
              <EquipmentCard
                key={item._id}
                item={item}
                onEdit={(i) => setEditingEquip(i)}
                onDelete={handleDeleteEquip}
              />
            ))}
          </div>
        )
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile Details</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="btn-close"><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateProfileSubmit} className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Location / City</label>
                <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Filmmaking Bio</label>
                <textarea rows={3} value={editBio} onChange={(e) => setEditBio(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Skills / Specializations (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Director, Cinematographer, Gaffer, Sound Mixer"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><ImageIcon size={14} /> Profile Picture</label>
                <input type="file" accept="image/*" onChange={(e) => setProfilePicFile(e.target.files[0])} />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowEditProfileModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={updatingProfile} className="btn btn-primary">
                  {updatingProfile ? <div className="spinner" style={{ width: 16, height: 16 }}></div> : <Save size={16} />}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={(msg) => {
            setToastMessage(msg);
            fetchProfileData();
          }}
        />
      )}

      {/* Edit Equipment Modal */}
      {editingEquip && (
        <EditEquipmentModal
          item={editingEquip}
          onClose={() => setEditingEquip(null)}
          onSuccess={(msg) => {
            setToastMessage(msg);
            fetchProfileData();
          }}
        />
      )}

      <style>{`
        .profile-page { display: flex; flex-direction: column; gap: 1.5rem; }

        .profile-header-card {
          padding: 2rem; display: flex; flex-direction: column; gap: 1rem;
        }

        .profile-top-row { display: flex; justify-content: space-between; align-items: center; }

        .avatar-section { display: flex; align-items: center; gap: 1.25rem; }

        .profile-avatar-lg {
          width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-amber);
        }

        .user-fullname { font-size: 1.8rem; color: var(--text-main); line-height: 1.2; }

        .profile-location { display: flex; align-items: center; gap: 0.3rem; color: var(--text-muted); font-size: 0.9rem; }

        .profile-stats-mini {
          display: flex; gap: 0.5rem; font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;
        }

        .profile-action-btns { display: flex; gap: 0.5rem; align-items: center; }

        .profile-bio-text { color: var(--text-muted); font-size: 0.98rem; max-width: 850px; }
        .skills-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }

        .profile-tabs-bar {
          display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;
        }

        .tab-btn {
          background: none; color: var(--text-muted); padding: 0.6rem 1.2rem; font-weight: 600;
          font-size: 0.92rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;
        }

        .tab-btn.active {
          background: var(--bg-card); color: var(--primary-amber); border: 1px solid var(--border-color);
        }

        .feed-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .equipment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

        .edit-form { display: flex; flex-direction: column; gap: 1rem; }

        @media (max-width: 900px) {
          .feed-grid, .equipment-grid { grid-template-columns: 1fr; }
          .profile-tabs-bar { flex-direction: column; }
          .profile-top-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>
    </div>
  );
}
