-- Create availability_settings table for managing house availability and booking rules
CREATE TABLE IF NOT EXISTS availability_settings (
  id BIGSERIAL PRIMARY KEY,
  house_id BIGINT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  check_in_from TIME NOT NULL DEFAULT '14:00',
  check_in_until TIME NOT NULL DEFAULT '22:00',
  check_out_from TIME NOT NULL DEFAULT '07:00',
  check_out_until TIME NOT NULL DEFAULT '11:00',
  min_booking_days INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(house_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_availability_settings_house_id ON availability_settings(house_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_availability_settings_updated_at 
  BEFORE UPDATE ON availability_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE availability_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view availability settings" ON availability_settings
  FOR SELECT USING (true);

CREATE POLICY "Hosts can insert their own availability settings" ON availability_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM houses 
      WHERE houses.id = availability_settings.house_id 
      AND houses.host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update their own availability settings" ON availability_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM houses 
      WHERE houses.id = availability_settings.house_id 
      AND houses.host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete their own availability settings" ON availability_settings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM houses 
      WHERE houses.id = availability_settings.house_id 
      AND houses.host_id = auth.uid()
    )
  );

-- Add comment
COMMENT ON TABLE availability_settings IS 'Stores check-in/check-out times and minimum booking requirements for each house';
