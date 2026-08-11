import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Dealer.css';

const sentimentEmoji = {
  positive: { icon: '😊', label: 'Positive', color: '#68d391' },
  negative: { icon: '😞', label: 'Negative', color: '#fc8181' },
  neutral: { icon: '😐', label: 'Neutral', color: '#fbd38d' },
};

function Dealer({ isLoggedIn, userName }) {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dealerRes, reviewsRes] = await Promise.all([
          fetch(`/djangoapp/get_dealer/${id}`),
          fetch(`/djangoapp/reviews/dealer/${id}`),
        ]);
        const dealerData = await dealerRes.json();
        const reviewsData = await reviewsRes.json();
        setDealer(dealerData.dealer || null);
        setReviews(reviewsData.reviews || []);
      } catch (err) {
        setError('Failed to load dealer information.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="dealer-loading">
        <div className="spinner"></div>
        <p>Loading dealer info...</p>
      </div>
    );
  }

  if (error || !dealer) {
    return (
      <div className="dealer-error">
        <p>{error || 'Dealer not found.'}</p>
        <Link to="/" className="back-btn">← Back to Dealers</Link>
      </div>
    );
  }

  return (
    <div className="dealer-page">
      {/* Dealer Header */}
      <div className="dealer-hero">
        <div className="dealer-hero-content">
          <Link to="/" className="back-link">← Back to All Dealers</Link>
          <div className="dealer-hero-info">
            <span className="dealer-hero-icon">🏢</span>
            <div>
              <h1>{dealer.full_name}</h1>
              <p className="dealer-location">📍 {dealer.city}, {dealer.state}</p>
              <p className="dealer-address">🗺️ {dealer.address}</p>
            </div>
          </div>
          <div className="dealer-stats">
            <div className="stat">
              <strong>{reviews.length}</strong>
              <span>Reviews</span>
            </div>
            <div className="stat">
              <strong>{dealer.st}</strong>
              <span>State</span>
            </div>
            <div className="stat">
              <strong>{dealer.zip}</strong>
              <span>ZIP Code</span>
            </div>
          </div>
          {isLoggedIn && (
            <Link to={`/dealer/${id}/review`} className="write-review-btn">
              ✍️ Write a Review
            </Link>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-container">
          <h2 className="reviews-title">Customer Reviews</h2>

          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>📝 No reviews yet. Be the first to review this dealership!</p>
              {isLoggedIn && (
                <Link to={`/dealer/${id}/review`} className="first-review-btn">
                  Write First Review
                </Link>
              )}
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => {
                const sent = sentimentEmoji[review.sentiment] || sentimentEmoji.neutral;
                return (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">
                        {review.name ? review.name[0].toUpperCase() : '?'}
                      </div>
                      <div className="reviewer-info">
                        <h4>{review.name}</h4>
                        {review.purchase && (
                          <span className="verified-badge">✅ Verified Purchase</span>
                        )}
                      </div>
                      <div
                        className="sentiment-badge"
                        style={{ borderColor: sent.color, color: sent.color }}
                        title={`Sentiment: ${sent.label}`}
                      >
                        {sent.icon} {sent.label}
                      </div>
                    </div>
                    <div className="review-body">
                      <p>"{review.review}"</p>
                    </div>
                    {review.car_make && (
                      <div className="review-footer">
                        <span className="car-info">
                          🚗 {review.car_make} {review.car_model} ({review.car_year})
                        </span>
                        {review.purchase_date && (
                          <span className="review-date">
                            📅 {new Date(review.purchase_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dealer;
