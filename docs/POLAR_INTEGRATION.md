# Polar.sh Integration

This directory contains the Polar.sh payment integration for the Collecty platform.

## Setup

### 1. Install Dependencies

```bash
npm install @polar-sh/sdk @polar-sh/nextjs
```

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_WEBHOOK_SECRET=your_webhook_secret
POLAR_SERVER=sandbox  # Change to 'production' for production
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Or your production URL
```

### 3. Generate Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 4. Configure Polar

1. Go to [Polar.sh](https://polar.sh) and sign in/create an account
2. Create an organization
3. Generate an access token in organization settings
4. Create products/subscriptions in the dashboard
5. Set up webhooks:
   - Endpoint URL: `https://your-domain.com/api/polar/webhook`
   - Events to subscribe to:
     - customer.state_changed
     - order.paid
     - order.refunded
     - subscription.created
     - subscription.updated
     - subscription.canceled
     - subscription.revoked
     - customer.created
     - customer.updated
   - Generate and copy the webhook secret

## API Endpoints

### Checkout

Create checkout sessions:

```
GET /api/polar/checkout?products=productId1,productId2&customerEmail=user@example.com
```

### Customer Portal

Manage subscriptions:

```
GET /api/polar/portal
```

Requires authentication.

### Webhook

Handles Polar webhook events:

```
POST /api/polar/webhook
```

## Database Schema

### Polar Customers

Links local users to Polar customers.

### Polar Subscriptions

Tracks active subscription status and billing periods.

### Polar Orders

Records one-time purchases and subscription renewals.

### Polar Checkouts

Tracks checkout session lifecycle.

## Helper Functions

### `/lib/polar-db.ts`

Database operations for Polar entities.

### `/lib/polar-helpers.ts`

Check subscription status and access control.

### `/lib/polar.ts`

Polar SDK client configuration.

## Usage

### Check Subscription Status

```typescript
import { hasActiveSubscription } from "@/lib/polar-helpers";

const isActive = await hasActiveSubscription(userId);
```

### Create Checkout

```typescript
// Redirect user to checkout
window.location.href = '/api/polar/checkout?products=your-product-id';
```

### Customer Portal

```typescript
// Redirect authenticated user to portal
window.location.href = '/api/polar/portal';
```
