# VISUAL Integrations Documentation

## Overview

This directory contains the integration layer for VISUAL's two critical external services:
- **Stripe Connect** — Payment processing, payouts, and financial transactions
- **Bunny.net CDN** — Content delivery and video hosting

## Architecture

```
lib/integrations/
├── config.ts                          # Central config for all integrations
├── stripe/
│   └── stripe-connect-service.ts      # Stripe Connect SDK wrapper
└── bunny/
    └── bunny-cdn-service.ts           # Bunny.net REST API wrapper

app/api/integrations/
├── health/route.ts                    # Health check for both services
├── stripe/
│   ├── connect/route.ts               # OAuth callback + account verification
│   ├── dashboard/route.ts             # Dashboard access for creators
│   └── webhooks/route.ts              # Stripe webhook handler (idempotent)
└── bunny/
    ├── upload/route.ts                # Video file upload endpoint
    └── signed-url/route.ts            # Signed URL generation
```

## Environment Variables Required

### Stripe Connect
```
STRIPE_SECRET_KEY                      # Stripe API secret key
STRIPE_PUBLISHABLE_KEY                 # Stripe publishable key
STRIPE_CONNECT_CLIENT_ID               # OAuth client ID for Connect
STRIPE_WEBHOOK_SECRET                  # Webhook signing secret
```

### Bunny.net CDN
```
BUNNY_API_KEY                          # Bunny API key (for management)
BUNNY_STORAGE_ZONE                     # Storage zone name (e.g., "visual-content")
BUNNY_STORAGE_KEY                      # Storage zone API key
BUNNY_CDN_HOSTNAME                     # CDN hostname (e.g., "visual-cdn.b-cdn.net")
BUNNY_PULLZONE_ID                      # Pull zone ID for playback
```

## Key Concepts

### Stripe Connect Flow

1. **Onboarding**: Creator visits `/api/integrations/stripe/connect?redirect_uri=...`
2. **OAuth**: User authorizes Stripe Connect account
3. **Account Created**: Stripe sends webhook with account details
4. **Verification**: Account status tracked (requires: email, identity, bank details)
5. **Payouts**: Creator withdrawals create transfers via Stripe Connect

### Bunny.net CDN Flow

1. **Upload**: Video uploaded via `/api/integrations/bunny/upload`
2. **Storage**: File stored in Bunny storage zone
3. **CDN**: Automatically served via global CDN
4. **Playback**: Signed URLs issued for authenticated playback
5. **Analytics**: Views tracked via Bunny analytics API

## Database Schema

### New Tables
- `webhook_events` — Stripe webhook deduplication (idempotency by event_id)
- `video_uploads` — Track all video uploads to Bunny (metadata, status, URLs)

### New User Columns
- `stripe_account_id` — Connected Stripe account ID
- `stripe_account_status` — "pending_verification", "verified", "restricted", etc.
- `stripe_account_details` — Full account details JSON

### New Investment Columns
- `stripe_charge_id` — Linked Stripe charge ID for idempotency
- `completed_at` — When payment confirmed by Stripe
- `refunded_at` — When refund completed (if any)
- `error` — Error message if charge failed

### New Payout Columns
- `stripe_transfer_id` — Stripe transfer ID for tracking
- `error` — Error message if transfer failed

## Usage Examples

### Check Integration Health
```bash
curl https://visual.app/api/integrations/health
```

### Initiate Stripe Connect
```typescript
import { stripeConnectService } from "@/lib/integrations/stripe/stripe-connect-service"

const authUrl = await stripeConnectService.getOAuthUrl({
  redirectUri: "https://visual.app/dashboard/wallet/verify",
  state: userId,
})

// Redirect user to authUrl
```

### Handle Stripe Webhook
```typescript
import { stripeConnectService } from "@/lib/integrations/stripe/stripe-connect-service"

const event = await stripeConnectService.constructEvent(req.body, signature)
// Event is now verified and safe to process
```

### Upload Video to Bunny
```typescript
import { bunnyService } from "@/lib/integrations/bunny/bunny-cdn-service"

const result = await bunnyService.uploadVideo({
  fileStream,
  filename: "video.mp4",
  contentId: projectId,
  creatorId: userId,
})

// result.bunnyUrl — CDN URL
// result.signedUrl — Playback URL with auth
```

### Generate Signed URL
```typescript
const signedUrl = bunnyService.generateSignedUrl({
  bunnyPath: "/videos/content-123.mp4",
  expirationMinutes: 24 * 60, // 24 hours
})
```

## Security Considerations

1. **Stripe Webhooks**: Always verify signature in `/api/integrations/stripe/webhooks`
2. **OAuth State**: Store state parameter and validate callback to prevent CSRF
3. **API Keys**: Keep Bunny storage key and Stripe secret in env vars only
4. **Signed URLs**: Always time-limit Bunny playback URLs (max 24 hours recommended)
5. **Idempotency**: Use stripe_charge_id / event_id for deduplication

## Testing

### Stripe Webhook Testing
```bash
# Use Stripe CLI to forward webhooks locally
stripe listen --forward-to localhost:3000/api/integrations/stripe/webhooks
```

### Bunny Upload Testing
```bash
curl -X POST https://visual.app/api/integrations/bunny/upload \
  -H "Authorization: Bearer USER_TOKEN" \
  -F "file=@video.mp4"
```

## Monitoring

Check `/api/integrations/health` regularly to ensure:
- Stripe API connectivity ✓
- Bunny.net API connectivity ✓
- Account verification status ✓
- Recent webhook delivery success ✓

## Next Steps for Implementation

1. Add `STRIPE_CONNECT_CLIENT_ID` and `BUNNY_*` env vars to Vercel
2. Create Stripe Connect OAuth pages
3. Integrate uploads into video creation flow
4. Set up Bunny webhook handlers for storage events
5. Implement creator payout UI using `stripeConnectService`
