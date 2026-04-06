-- Migration 027: Create stripe_config table for secure Stripe key storage
-- This table stores encrypted Stripe API keys configurable from the ADMIN dashboard

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_config (
  id                    SERIAL PRIMARY KEY,
  test_secret_key       TEXT,
  test_publishable_key  TEXT,
  test_webhook_secret   TEXT,
  live_secret_key       TEXT,
  live_publishable_key  TEXT,
  live_webhook_secret   TEXT,
  active_mode           VARCHAR(10) NOT NULL DEFAULT 'test',
  connect_client_id     TEXT,
  updated_by            TEXT,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT stripe_config_singleton CHECK (id = 1)
);

-- Insert default singleton row
INSERT INTO stripe_config (id, active_mode)
VALUES (1, 'test')
ON CONFLICT (id) DO NOTHING;

-- Add comment
COMMENT ON TABLE stripe_config IS 'Singleton table (id=1) storing encrypted Stripe API configuration';
