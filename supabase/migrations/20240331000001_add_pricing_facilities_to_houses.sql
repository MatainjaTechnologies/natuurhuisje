-- Add pricing facilities column to houses table
ALTER TABLE houses 
ADD COLUMN IF NOT EXISTS included_facilities TEXT[] DEFAULT '{}';

-- Add comment to explain the column
COMMENT ON COLUMN houses.included_facilities IS 'Array of facilities included in the price (e.g., cleaning, linen, utilities)';
