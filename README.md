# Billing and Inventory System

A comprehensive billing and inventory management system with subscription management capabilities.

## Features

- **Subscription Management**: View all active and cancelled subscriptions
- **Subscription Cancellation**: Cancel active subscriptions with a single click
- **Subscription Reactivation**: Reactivate cancelled subscriptions
- **RESTful API**: Complete API for subscription management
- **Modern UI**: Beautiful, responsive web interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/thirukumararaja/Billing-and-Inventory-.git
cd Billing-and-Inventory-
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Running the Application

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Running Tests

Run the test suite:
```bash
npm test
```

## API Endpoints

### Get All Subscriptions
```
GET /api/subscriptions
```
Returns a list of all subscriptions.

### Get Specific Subscription
```
GET /api/subscriptions/:id
```
Returns details of a specific subscription.

### Cancel Subscription
```
POST /api/subscriptions/:id/cancel
```
Cancels an active subscription. Returns error if subscription is already cancelled.

### Reactivate Subscription
```
POST /api/subscriptions/:id/reactivate
```
Reactivates a cancelled subscription. Returns error if subscription is already active.

## Project Structure

```
.
├── server.js           # Main application server
├── server.test.js      # API tests
├── public/
│   └── index.html     # Web interface
├── package.json        # Project dependencies
└── README.md          # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Testing**: Jest, Supertest
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Security**: express-rate-limit

## Security

The application includes the following security measures:

- **Rate Limiting**: API endpoints are protected with rate limiting (100 requests per 15 minutes per IP address)
- **Input Validation**: All endpoints validate input and return appropriate error messages
- **Error Handling**: Proper error handling to prevent information leakage

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication and authorization
- Payment gateway integration
- Email notifications for subscription changes
- Subscription analytics and reporting
- Multiple subscription tiers
- Inventory management features