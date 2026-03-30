-- Enable btree_gist extension for exclusion constraints with scalar types
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Create special_pricing table for seasonal/occasion-based pricing
CREATE TABLE IF NOT EXISTS special_pricing (
  id BIGSERIAL PRIMARY KEY,
  house_id BIGINT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  occasion_name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure start_date is before end_date
  CONSTRAINT valid_date_range CHECK (start_date <= end_date),
  
  -- Ensure price is positive
  CONSTRAINT positive_price CHECK (price_per_night > 0),
  
  -- Prevent overlapping date ranges for the same house
  EXCLUDE USING gist (
    house_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  )
);

-- Create index for faster queries
CREATE INDEX idx_special_pricing_house_id ON special_pricing(house_id);
CREATE INDEX idx_special_pricing_dates ON special_pricing(start_date, end_date);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_special_pricing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_special_pricing_updated_at
  BEFORE UPDATE ON special_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_special_pricing_updated_at();

-- Add RLS policies
ALTER TABLE special_pricing ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view special pricing for any house
CREATE POLICY "Anyone can view special pricing"
  ON special_pricing
  FOR SELECT
  USING (true);

-- Policy: Only house owners can insert special pricing
CREATE POLICY "House owners can insert special pricing"
  ON special_pricing
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM houses
      WHERE houses.id = special_pricing.house_id
      AND houses.host_id = auth.uid()
    )
  );

-- Policy: Only house owners can update their special pricing
CREATE POLICY "House owners can update special pricing"
  ON special_pricing
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM houses
      WHERE houses.id = special_pricing.house_id
      AND houses.host_id = auth.uid()
    )
  );

-- Policy: Only house owners can delete their special pricing
CREATE POLICY "House owners can delete special pricing"
  ON special_pricing
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM houses
      WHERE houses.id = special_pricing.house_id
      AND houses.host_id = auth.uid()
    )
  );
