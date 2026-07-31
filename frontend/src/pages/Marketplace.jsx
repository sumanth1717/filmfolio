import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Filter, PlusCircle, DollarSign, MapPin, Tag, RefreshCw, X, Sparkles, Navigation, ChevronRight } from 'lucide-react';
import { getEquipment, deleteEquipment, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EquipmentCard from '../components/EquipmentCard';
import EquipmentDetailModal from '../components/EquipmentDetailModal';
import ReplyModal from '../components/ReplyModal';
import EditEquipmentModal from '../components/EditEquipmentModal';
import Toast from '../components/Toast';

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [customLocation, setCustomLocation] = useState('');
  const [maxDistance, setMaxDistance] = useState('any');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [selectedItemForInquiry, setSelectedItemForInquiry] = useState(null);
  const [inquiryInitialData, setInquiryInitialData] = useState({});
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);

  const categories = ['All', 'Camera', 'Lenses', 'Lighting', 'Audio', 'Grip & Rigging', 'Drones', 'Other'];
  const indianCities = ['All', 'Vijayawada', 'Guntur', 'Mangalagiri', 'Amaravati', 'Visakhapatnam (Vizag)', 'Hyderabad'];

  const fetchMarketplaceGear = async () => {
    try {
      setLoading(true);
      setError('');
      const locFilter = selectedCity !== 'All' ? selectedCity : customLocation;
      const data = await getEquipment({
        category: selectedCategory,
        type: selectedType,
        minPrice,
        maxPrice,
        location: locFilter,
        search: searchQuery,
        sort: sortBy
      });

      if (data.success) {
        let items = data.equipment || [];
        if (maxDistance !== 'any') {
          const limit = Number(maxDistance);
          items = items.filter((item) => (item.distanceMiles || 5) <= limit);
        }
        setEquipment(items);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMarketplaceGear();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedType, minPrice, maxPrice, selectedCity, customLocation, maxDistance, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedType('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedCity('All');
    setCustomLocation('');
    setMaxDistance('any');
    setSearchQuery('');
    setSortBy('newest');
  };

  const handlePricePreset = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleInquireClick = (item, initialData = {}) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setInquiryInitialData(initialData);
    setSelectedItemForInquiry(item);
  };

  const handleEditClick = (item) => {
    setSelectedItemForEdit(item);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment listing?')) return;
    try {
      await deleteEquipment(id);
      setToastMessage('Equipment listing deleted');
      setEquipment(equipment.filter((item) => item._id !== id));
    } catch (err) {
      setToastMessage(getErrorMessage(err));
    }
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedType !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    selectedCity !== 'All' ||
    customLocation !== '' ||
    maxDistance !== 'any' ||
    searchQuery !== '';

  const featuredGear = equipment.slice(0, 3);

  return (
    <div className="marketplace-page">
      {toastMessage && (
        <Toast type="success" message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShoppingBag size={28} className="text-amber" /> Cinema Gear Rental Marketplace
          </h1>
          <p className="page-subtitle">Rent professional cameras, lenses, lighting, and audio equipment in Vijayawada, Guntur & AP region.</p>
        </div>

        {isAuthenticated && (
          <Link to="/equipment/new" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>List Equipment</span>
          </Link>
        )}
      </div>

      {/* Featured Gear Hero Showcase Banner */}
      {featuredGear.length > 0 && (
        <div className="card featured-carousel-card">
          <div className="carousel-header">
            <Sparkles size={16} className="text-amber" />
            <span>FEATURED CINEMA PACKAGES IN VIJAYAWADA & GUNTUR</span>
          </div>

          <div className="carousel-grid">
            {featuredGear.map((item) => (
              <div
                key={`feat-${item._id}`}
                className="featured-item-tile"
                onClick={() => setSelectedItemForDetail(item)}
              >
                <img src={item.image} alt={item.title} className="tile-img" />
                <div className="tile-gradient-overlay">
                  <span className="badge badge-amber">₹{item.pricePerDay} / day</span>
                  <h4 className="tile-title">{item.title}</h4>
                  <div className="tile-meta">
                    <span><MapPin size={12} /> {item.location}</span>
                    <span>📍 ~{item.distanceMiles || 5} mi</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="marketplace-layout">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar card">
          <div className="sidebar-title-row">
            <div className="sidebar-title">
              <Filter size={18} className="text-amber" />
              <span>Filter Gear</span>
            </div>

            {hasActiveFilters && (
              <button onClick={handleResetFilters} className="btn-reset-text" title="Reset all filters">
                <RefreshCw size={13} /> Reset
              </button>
            )}
          </div>

          {/* Location Dropdown Options */}
          <div className="filter-group">
            <label className="filter-label"><MapPin size={14} /> City / Location Filter</label>
            <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setCustomLocation(''); }}>
              <option value="All">All Cities (AP & Telangana Region)</option>
              {indianCities.filter(c => c !== 'All').map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Categories</label>
            <div className="category-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Listing Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Listing Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All Listings</option>
              <option value="available_to_rent">Available for Rent</option>
              <option value="looking_to_rent">Wanted / Request</option>
            </select>
          </div>

          {/* Distance Radius Filter */}
          <div className="filter-group">
            <label className="filter-label"><Navigation size={14} /> Distance Radius</label>
            <select value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)}>
              <option value="any">Any Distance</option>
              <option value="5">Within 5 Miles</option>
              <option value="15">Within 15 Miles</option>
              <option value="30">Within 30 Miles</option>
              <option value="50">Within 50 Miles</option>
            </select>
          </div>

          {/* Price Range Filter & Presets (INR ₹) */}
          <div className="filter-group">
            <label className="filter-label">Daily Rate (₹ INR)</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="price-preset-chips">
              <button
                type="button"
                className={`preset-chip ${minPrice === '' && maxPrice === '5000' ? 'active' : ''}`}
                onClick={() => handlePricePreset('', '5000')}
              >
                &lt; ₹5k
              </button>
              <button
                type="button"
                className={`preset-chip ${minPrice === '5000' && maxPrice === '15000' ? 'active' : ''}`}
                onClick={() => handlePricePreset('5000', '15000')}
              >
                ₹5k-₹15k
              </button>
              <button
                type="button"
                className={`preset-chip ${minPrice === '15000' && maxPrice === '' ? 'active' : ''}`}
                onClick={() => handlePricePreset('15000', '')}
              >
                ₹15k+
              </button>
            </div>
          </div>
        </aside>

        {/* Listings Section */}
        <main className="marketplace-main">
          {/* Top Sort & Search Toolbar */}
          <div className="toolbar-bar">
            <div className="search-form">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search Alexa 35, RED V-Raptor, Master Anamorphic, Aputure, Sound Devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="clear-search-btn">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="sort-dropdown">
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges Bar */}
          {hasActiveFilters && (
            <div className="active-filters-bar">
              <span className="active-filters-label">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="active-filter-pill">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}><X size={12} /></button>
                </span>
              )}
              {selectedCity !== 'All' && (
                <span className="active-filter-pill">
                  City: {selectedCity}
                  <button onClick={() => setSelectedCity('All')}><X size={12} /></button>
                </span>
              )}
              {maxDistance !== 'any' && (
                <span className="active-filter-pill">
                  Radius: Within {maxDistance} mi
                  <button onClick={() => setMaxDistance('any')}><X size={12} /></button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="active-filter-pill">
                  Type: {selectedType === 'available_to_rent' ? 'For Rent' : 'Wanted'}
                  <button onClick={() => setSelectedType('all')}><X size={12} /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="active-filter-pill">
                  Price: ₹{minPrice || '0'} - ₹{maxPrice || '∞'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><X size={12} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="active-filter-pill">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X size={12} /></button>
                </span>
              )}
              <button onClick={handleResetFilters} className="clear-all-pill-btn">
                Clear All
              </button>
            </div>
          )}

          {/* Equipment Cards Grid */}
          {loading ? (
            <div className="loading-center">
              <div className="spinner"></div>
              <p>Filtering equipment listings...</p>
            </div>
          ) : error ? (
            <div className="error-banner">{error}</div>
          ) : equipment.length === 0 ? (
            <div className="empty-state card">
              <h3>No equipment listings match your filter criteria</h3>
              <p>Try resetting your category, city, radius, or price range filters.</p>
              <button onClick={handleResetFilters} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="equipment-grid">
              {equipment.map((item) => (
                <EquipmentCard
                  key={item._id}
                  item={item}
                  onDetail={(i) => setSelectedItemForDetail(i)}
                  onInquire={handleInquireClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Equipment Detail Specs & Price Calc Modal */}
      {selectedItemForDetail && (
        <EquipmentDetailModal
          item={selectedItemForDetail}
          onClose={() => setSelectedItemForDetail(null)}
          onInquire={(item, initialData) => handleInquireClick(item, initialData)}
        />
      )}

      {/* Inquiry Modal */}
      {selectedItemForInquiry && (
        <ReplyModal
          target={selectedItemForInquiry}
          targetType="Equipment"
          initialData={inquiryInitialData}
          onClose={() => setSelectedItemForInquiry(null)}
          onSuccess={(msg) => setToastMessage(msg)}
        />
      )}

      {/* Edit Equipment Modal */}
      {selectedItemForEdit && (
        <EditEquipmentModal
          item={selectedItemForEdit}
          onClose={() => setSelectedItemForEdit(null)}
          onSuccess={(msg) => {
            setToastMessage(msg);
            fetchMarketplaceGear();
          }}
        />
      )}

      <style>{`
        .marketplace-page { display: flex; flex-direction: column; gap: 1.5rem; }

        .featured-carousel-card {
          padding: 1.25rem; background: linear-gradient(135deg, #141c2b 0%, #1b263b 100%); border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .carousel-header {
          display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 800; letter-spacing: 0.08em; color: var(--primary-amber); margin-bottom: 1rem;
        }

        .carousel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

        .featured-item-tile {
          position: relative; height: 160px; border-radius: var(--radius-sm); overflow: hidden; cursor: pointer; border: 1px solid var(--border-color);
        }

        .tile-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .featured-item-tile:hover .tile-img { transform: scale(1.08); }

        .tile-gradient-overlay {
          position: absolute; bottom: 0; left: 0; right: 0; top: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(11,15,23,0.92) 100%);
          padding: 0.85rem; display: flex; flex-direction: column; justify-content: flex-end;
        }

        .tile-title { font-size: 0.95rem; color: white; font-weight: 700; margin-top: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tile-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem; }

        .marketplace-layout { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start; }
        .filter-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }

        .sidebar-title-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color); }
        .sidebar-title { font-weight: 700; font-size: 1.1rem; color: white; display: flex; align-items: center; gap: 0.5rem; }

        .btn-reset-text {
          background: none; color: var(--primary-amber); font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; padding: 0.2rem 0.4rem; border-radius: var(--radius-sm);
        }

        .filter-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .filter-label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 0.3rem; }

        .category-list { display: flex; flex-direction: column; gap: 0.25rem; }

        .category-btn {
          text-align: left; background: none; color: var(--text-muted); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); font-size: 0.88rem; transition: background 0.2s, color 0.2s;
        }

        .category-btn:hover { background: rgba(255, 255, 255, 0.05); color: white; }
        .category-btn.active { background: rgba(245, 158, 11, 0.15); color: var(--primary-amber); font-weight: 700; }

        .price-inputs { display: flex; align-items: center; gap: 0.5rem; }
        .price-inputs span { color: var(--text-muted); font-size: 0.85rem; }

        .price-preset-chips { display: flex; gap: 0.35rem; margin-top: 0.35rem; }
        .preset-chip { flex: 1; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.75rem; padding: 0.25rem 0.4rem; border-radius: var(--radius-sm); }
        .preset-chip.active { background: rgba(245, 158, 11, 0.2); color: var(--primary-amber); border-color: var(--primary-amber); font-weight: 700; }

        .toolbar-bar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; background: var(--bg-card); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); }

        .search-form { position: relative; display: flex; align-items: center; flex: 1; }
        .search-icon { position: absolute; left: 12px; color: var(--text-muted); }
        .search-form input { padding-left: 2.2rem; padding-right: 2rem; }
        .clear-search-btn { position: absolute; right: 10px; background: none; color: var(--text-muted); display: flex; align-items: center; }

        .sort-dropdown { display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; color: var(--text-muted); white-space: nowrap; }
        .sort-dropdown select { width: auto; padding: 0.4rem 0.8rem; }

        .active-filters-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; background: rgba(255, 255, 255, 0.03); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); }
        .active-filters-label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
        .active-filter-pill { display: inline-flex; align-items: center; gap: 0.35rem; background: rgba(245, 158, 11, 0.15); color: var(--primary-amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
        .active-filter-pill button { background: none; color: inherit; display: flex; align-items: center; }
        .clear-all-pill-btn { background: none; color: var(--rose-danger); font-size: 0.78rem; font-weight: 600; margin-left: auto; padding: 0.2rem 0.4rem; }

        .equipment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

        @media (max-width: 1100px) {
          .equipment-grid { grid-template-columns: repeat(2, 1fr); }
          .carousel-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 850px) {
          .marketplace-layout { grid-template-columns: 1fr; }
          .equipment-grid { grid-template-columns: 1fr; }
          .toolbar-bar { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
