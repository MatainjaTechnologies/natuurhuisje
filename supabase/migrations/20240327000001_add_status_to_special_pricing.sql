-- Add status column to special_pricing table
ALTER TABLE special_pricing
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired'));

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_special_pricing_status ON special_pricing(status);

-- Create function to automatically update status based on dates
CREATE OR REPLACE FUNCTION update_special_pricing_status()
RETURNS void AS $$
BEGIN
  -- Mark as expired if end_date has passed
  UPDATE special_pricing
  SET status = 'expired'
  WHERE end_date < CURRENT_DATE
  AND status != 'expired';
END;
$$ LANGUAGE plpgsql;

-- Create a view that only shows active and valid special pricing
CREATE OR REPLACE VIEW active_special_pricing AS
SELECT *
FROM special_pricing
WHERE status = 'active'
AND end_date >= CURRENT_DATE;

-- Add comment to explain status values
COMMENT ON COLUMN special_pricing.status IS 'Status of special pricing: active (visible and usable), inactive (hidden by host), expired (end_date has passed)';
