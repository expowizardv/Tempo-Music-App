/*
  # Add subscription features

  1. Changes
    - Add subscription_tier to profiles table
    - Add subscription_status to profiles table
    - Add subscription_period_end to profiles table

  2. Security
    - Update RLS policies for profiles table
*/

ALTER TABLE profiles
ADD COLUMN subscription_tier text NOT NULL DEFAULT 'free',
ADD COLUMN subscription_status text,
ADD COLUMN subscription_period_end timestamptz;

-- Update profiles policies
CREATE POLICY "Users can read subscription info"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update subscription info"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);