-- Add detailed pricing breakdown columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS nights INTEGER,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS regular_nights INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS regular_nights_total DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS special_nights INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS special_nights_total DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cleaning_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS service_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_breakdown JSONB;

-- Add comment to explain the price_breakdown structure
COMMENT ON COLUMN bookings.price_breakdown IS 'JSON array containing daily pricing: [{"date": "2024-03-20", "price": 50, "isSpecialPricing": false, "occasionName": ""}]';
