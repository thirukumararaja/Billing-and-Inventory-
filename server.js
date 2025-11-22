const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage for subscriptions (in production, use a database)
const subscriptions = new Map();

// Initialize with sample subscriptions
subscriptions.set('1', {
  id: '1',
  userId: 'user123',
  planName: 'Premium Plan',
  status: 'active',
  startDate: '2024-01-01',
  billingCycle: 'monthly',
  price: 29.99
});

subscriptions.set('2', {
  id: '2',
  userId: 'user456',
  planName: 'Basic Plan',
  status: 'active',
  startDate: '2024-02-15',
  billingCycle: 'yearly',
  price: 99.99
});

// Routes

// Get all subscriptions
app.get('/api/subscriptions', (req, res) => {
  const allSubscriptions = Array.from(subscriptions.values());
  res.json(allSubscriptions);
});

// Get a specific subscription
app.get('/api/subscriptions/:id', (req, res) => {
  const subscription = subscriptions.get(req.params.id);
  
  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }
  
  res.json(subscription);
});

// Cancel subscription
app.post('/api/subscriptions/:id/cancel', (req, res) => {
  const subscriptionId = req.params.id;
  const subscription = subscriptions.get(subscriptionId);
  
  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }
  
  if (subscription.status === 'cancelled') {
    return res.status(400).json({ error: 'Subscription is already cancelled' });
  }
  
  // Update subscription status
  subscription.status = 'cancelled';
  subscription.cancelledDate = new Date().toISOString();
  subscriptions.set(subscriptionId, subscription);
  
  res.json({
    success: true,
    message: 'Subscription cancelled successfully',
    subscription: subscription
  });
});

// Reactivate subscription (for testing purposes)
app.post('/api/subscriptions/:id/reactivate', (req, res) => {
  const subscriptionId = req.params.id;
  const subscription = subscriptions.get(subscriptionId);
  
  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }
  
  if (subscription.status === 'active') {
    return res.status(400).json({ error: 'Subscription is already active' });
  }
  
  subscription.status = 'active';
  delete subscription.cancelledDate;
  subscriptions.set(subscriptionId, subscription);
  
  res.json({
    success: true,
    message: 'Subscription reactivated successfully',
    subscription: subscription
  });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to manage subscriptions`);
});

// Export for testing
module.exports = { app, server, subscriptions };
