import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Dealers.css';

const US_STATES = [
  'All', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
  'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

function Dealers({ isLoggedIn, userName }) {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('All');
  const [error, setError] = useState('');
  const location = useLocation();

  const fetchDealers = async (state = 'All') => {
    setLoading(true);
    setError('');
    try {
      const url = state === 'All'
        ? '/djangoapp/get_dealers'
        : `/djangoapp/get_dealers/${state}`;
      const response = await fetch(url);
      const data = await response.json();
      setDealers(data.dealers || []);
    } catch (err) {
      setError('Failed to load dealers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers(selectedState);
  }, [selectedState]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  return (
    <div className="dealers-page">
      {/* Hero */}
      <div className="dealers-hero">
        <div className="hero-content">
          <h1>🚗 Find Your Nearest Dealership</h1>
          <p>Browse our nationwide network of xAutomotive dealerships</p>
          {isLoggedIn && (
            <div className="logged-in-badge">
              ✅ Logged in as <strong>{userName}</strong> — You can now submit reviews!
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="dealers-filters">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="state-filter">Filter by State:</label>
            <select
              id="state-filter"
              value={selectedState}
              onChange={handleStateChange}
              className="state-select"
            >
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="results-count">
            {!loading && (
              <span>{dealers.length} dealership{dealers.length !== 1 ? 's' : ''} found</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="dealers-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading dealerships...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => fetchDealers(selectedState)} className="retry-btn">
              Retry
            </button>
          </div>
        ) : dealers.length === 0 ? (
          <div className="empty-state">
            <p>🔍 No dealerships found in {selectedState}.</p>
          </div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Dealer Name</th>
                <th>City</th>
                <th>Address</th>
                <th>ZIP</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map(dealer => (
                <tr key={dealer.id}>
                  <td>{dealer.id}</td>
                  <td>{dealer.full_name}</td>
                  <td>{dealer.city}</td>
                  <td>{dealer.address}</td>
                  <td>{dealer.zip}</td>
                  <td>{dealer.state}</td>
                  <td>
                    <Link to={`/dealer/${dealer.id}`} className="view-reviews-btn" style={{ marginRight: '10px' }}>
                      View Reviews
                    </Link>
                    {isLoggedIn && (
                      <Link to={`/dealer/${dealer.id}/review`} className="review-dealer-btn">
                        Review Dealer
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dealers;
