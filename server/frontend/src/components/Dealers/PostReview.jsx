import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './PostReview.css';

function PostReview({ userName }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState(null);
  const [carModels, setCarModels] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: userName || '',
    review: '',
    purchase: false,
    purchase_date: '',
    car_make: '',
    car_model: '',
    car_year: new Date().getFullYear(),
  });

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const res = await fetch(`/djangoapp/get_dealer/${id}`);
        const data = await res.json();
        setDealer(data.dealer);
      } catch (e) {}
    };

    const fetchCars = async () => {
      try {
        const res = await fetch('/djangoapp/get_cars');
        const data = await res.json();
        setCarModels(data.cars || []);
      } catch (e) {}
    };

    fetchDealer();
    fetchCars();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/djangoapp/add_review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          dealership: parseInt(id),
          time: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      if (data.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate(`/dealer/${id}`), 2000);
      }
    } catch (err) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="review-success">
        <div className="success-icon">🎉</div>
        <h2>Review Submitted!</h2>
        <p>Thank you for your feedback. Redirecting back to dealer page...</p>
      </div>
    );
  }

  return (
    <div className="post-review-page">
      <div className="post-review-container">
        {/* Header */}
        <div className="post-review-header">
          <Link to={`/dealer/${id}`} className="back-link">← Back to Dealer</Link>
          <h1>✍️ Write a Review</h1>
          {dealer && (
            <p className="dealer-name-label">
              For: <strong>{dealer.full_name}</strong> — {dealer.city}, {dealer.state}
            </p>
          )}
        </div>

        {/* Form */}
        <form className="post-review-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-field">
            <label htmlFor="review-name">Your Name</label>
            <input
              id="review-name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Review Text */}
          <div className="form-field">
            <label htmlFor="review-text">Your Review</label>
            <textarea
              id="review-text"
              name="review"
              placeholder="Share your experience with this dealership..."
              value={formData.review}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          {/* Purchase Checkbox */}
          <div className="form-field form-check">
            <input
              id="review-purchase"
              type="checkbox"
              name="purchase"
              checked={formData.purchase}
              onChange={handleChange}
            />
            <label htmlFor="review-purchase">I purchased a car at this dealership</label>
          </div>

          {/* Purchase Date */}
          {formData.purchase && (
            <div className="form-field">
              <label htmlFor="purchase-date">Purchase Date</label>
              <input
                id="purchase-date"
                type="date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Car Make */}
          <div className="form-field">
            <label htmlFor="car-make">Car Make</label>
            <input
              id="car-make"
              type="text"
              name="car_make"
              placeholder="e.g. Toyota, Honda"
              value={formData.car_make}
              onChange={handleChange}
            />
          </div>

          {/* Car Model */}
          <div className="form-field">
            <label htmlFor="car-model">Car Model</label>
            <input
              id="car-model"
              type="text"
              name="car_model"
              placeholder="e.g. Camry, Accord"
              value={formData.car_model}
              onChange={handleChange}
            />
          </div>

          {/* Car Year */}
          <div className="form-field">
            <label htmlFor="car-year">Car Year</label>
            <input
              id="car-year"
              type="number"
              name="car_year"
              min="2000"
              max="2024"
              value={formData.car_year}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-review-btn"
            disabled={submitting}
          >
            {submitting ? '⏳ Submitting...' : '🚀 Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostReview;
