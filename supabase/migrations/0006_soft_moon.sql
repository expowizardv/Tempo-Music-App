/*
  # Add Stripe webhook handling

  1. New Tables
    - `stripe_events`
      - `id` (text, primary key) - Stripe event ID
      - `type` (text) - Event type
      - `status` (text) - Processing status
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `stripe_events` table
    - Add policy for service role access
*/

CREATE TABLE stripe_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage stripe events"
  ON stripe_events
  TO service_role
  USING (true)
  WITH CHECK (true);