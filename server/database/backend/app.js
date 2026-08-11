/**
 * Node.js Express Microservice for xAutomotive
 * Handles: Dealers and Reviews data
 * Port: 3030
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

// Load data from JSON files
const dealersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'dealers.json'), 'utf8')
);
const reviewsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8')
);

let dealers = dealersData.dealers;
let reviews = reviewsData.reviews;

// ─────────────────────────────────────────────
//  Health check
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'xAutomotive Node.js Microservice running' });
});

// ─────────────────────────────────────────────
//  Dealer Routes
// ─────────────────────────────────────────────

// GET /fetchdealers - Get all dealers
app.get('/fetchdealers', (req, res) => {
  res.json({ status: 200, dealers: dealers });
});

// GET /fetchdealers/:state - Get dealers by state
app.get('/fetchdealers/:state', (req, res) => {
  const state = req.params.state;
  const filtered = dealers.filter(
    d => d.state.toLowerCase() === state.toLowerCase() ||
         d.st.toLowerCase() === state.toLowerCase()
  );
  res.json({ status: 200, dealers: filtered });
});

// GET /fetchdealer/:id - Get specific dealer
app.get('/fetchdealer/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const dealer = dealers.find(d => d.id === id);
  if (dealer) {
    res.json({ status: 200, dealer: dealer });
  } else {
    res.status(404).json({ status: 404, error: 'Dealer not found' });
  }
});

// ─────────────────────────────────────────────
//  Review Routes
// ─────────────────────────────────────────────

// GET /fetchreviews - Get all reviews
app.get('/fetchreviews', (req, res) => {
  res.json({ status: 200, reviews: reviews });
});

// GET /fetchreviews/dealer/:id - Get reviews for a specific dealer
app.get('/fetchreviews/dealer/:id', (req, res) => {
  const dealerId = parseInt(req.params.id);
  const dealerReviews = reviews.filter(r => r.dealership === dealerId);
  res.json({ status: 200, reviews: dealerReviews });
});

// POST /insertreview - Add a new review
app.post('/insertreview', (req, res) => {
  const newReview = {
    id: reviews.length + 1,
    ...req.body,
    created_at: new Date().toISOString()
  };
  reviews.push(newReview);
  res.json({ status: 200, message: 'Review added successfully', review: newReview });
});

// DELETE /deletereview/:id - Delete a review
app.delete('/deletereview/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = reviews.findIndex(r => r.id === id);
  if (index !== -1) {
    reviews.splice(index, 1);
    res.json({ status: 200, message: 'Review deleted successfully' });
  } else {
    res.status(404).json({ status: 404, error: 'Review not found' });
  }
});

// ─────────────────────────────────────────────
//  Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`xAutomotive Microservice running on port ${PORT}`);
  console.log(`Dealers loaded: ${dealers.length}`);
  console.log(`Reviews loaded: ${reviews.length}`);
});

module.exports = app;
