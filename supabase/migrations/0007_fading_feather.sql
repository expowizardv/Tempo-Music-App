/*
  # Add Stripe webhook handling

  1. Changes
    - Create stripe_events table for tracking webhook events
    - Add RLS policies for stripe_events
    - Add subscription fields to profiles if they don't exist
*/

-- Create table for tracking Stripe webhook events if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'stripe_events' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policy if it exists and create new one
DO $$
BEGIN
  DROP POLICY IF EXISTS "Service role can manage stripe events" ON stripe_events;
  
  CREATE POLICY "Service role can manage stripe events"
    ON stripe_events
    TO service_role
    USING (true)
    WITH CHECK (true);
END $$;

-- Add subscription fields to profiles if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN subscription_tier text NOT NULL DEFAULT 'free',
    ADD COLUMN subscription_status text,
    ADD COLUMN subscription_period_end timestamptz;
  END IF;
END $$;