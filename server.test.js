const request = require('supertest');
const { app, server, subscriptions } = require('./server');

describe('Subscription Management API', () => {
  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    // Reset subscriptions to initial state before each test
    subscriptions.clear();
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
  });

  describe('GET /api/subscriptions', () => {
    it('should return all subscriptions', async () => {
      const response = await request(app).get('/api/subscriptions');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].planName).toBe('Premium Plan');
    });
  });

  describe('GET /api/subscriptions/:id', () => {
    it('should return a specific subscription', async () => {
      const response = await request(app).get('/api/subscriptions/1');
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.planName).toBe('Premium Plan');
    });

    it('should return 404 for non-existent subscription', async () => {
      const response = await request(app).get('/api/subscriptions/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Subscription not found');
    });
  });

  describe('POST /api/subscriptions/:id/cancel', () => {
    it('should cancel an active subscription', async () => {
      const response = await request(app)
        .post('/api/subscriptions/1/cancel')
        .send();
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.subscription.status).toBe('cancelled');
      expect(response.body.subscription.cancelledDate).toBeDefined();
    });

    it('should return 404 for non-existent subscription', async () => {
      const response = await request(app)
        .post('/api/subscriptions/999/cancel')
        .send();
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Subscription not found');
    });

    it('should return 400 when trying to cancel already cancelled subscription', async () => {
      // First cancellation
      await request(app).post('/api/subscriptions/1/cancel').send();
      
      // Second cancellation attempt
      const response = await request(app)
        .post('/api/subscriptions/1/cancel')
        .send();
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Subscription is already cancelled');
    });

    it('should persist cancellation in storage', async () => {
      await request(app).post('/api/subscriptions/1/cancel').send();
      
      const response = await request(app).get('/api/subscriptions/1');
      
      expect(response.body.status).toBe('cancelled');
      expect(response.body.cancelledDate).toBeDefined();
    });
  });

  describe('POST /api/subscriptions/:id/reactivate', () => {
    it('should reactivate a cancelled subscription', async () => {
      // First cancel the subscription
      await request(app).post('/api/subscriptions/1/cancel').send();
      
      // Then reactivate it
      const response = await request(app)
        .post('/api/subscriptions/1/reactivate')
        .send();
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.subscription.status).toBe('active');
      expect(response.body.subscription.cancelledDate).toBeUndefined();
    });

    it('should return 404 for non-existent subscription', async () => {
      const response = await request(app)
        .post('/api/subscriptions/999/reactivate')
        .send();
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Subscription not found');
    });

    it('should return 400 when trying to reactivate already active subscription', async () => {
      const response = await request(app)
        .post('/api/subscriptions/1/reactivate')
        .send();
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Subscription is already active');
    });
  });
});
