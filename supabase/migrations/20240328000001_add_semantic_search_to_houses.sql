-- Add semantic search capabilities to houses table

-- Add tsvector column for full-text search
ALTER TABLE houses
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_houses_search_vector ON houses USING GIN(search_vector);

-- Create function to generate search vector from house data
CREATE OR REPLACE FUNCTION houses_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.accommodation_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.place, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.type, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.amenities, ' '), '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.street, '')), 'D') ||
    setweight(to_tsvector('english', COALESCE(NEW.region, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search_vector on insert/update
DROP TRIGGER IF EXISTS houses_search_vector_trigger ON houses;
CREATE TRIGGER houses_search_vector_trigger
  BEFORE INSERT OR UPDATE ON houses
  FOR EACH ROW
  EXECUTE FUNCTION houses_search_vector_update();

-- Update existing records with search vectors
UPDATE houses SET search_vector = 
  setweight(to_tsvector('english', COALESCE(accommodation_name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(location, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(place, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(type, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(amenities, ' '), '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(street, '')), 'D') ||
  setweight(to_tsvector('english', COALESCE(region, '')), 'C');

-- Create function for semantic search with ranking
CREATE OR REPLACE FUNCTION search_houses(search_query text, max_results int DEFAULT 20)
RETURNS TABLE (
  id bigint,
  accommodation_name text,
  description text,
  location text,
  place text,
  type text,
  price_per_night numeric,
  max_person int,
  bedrooms int,
  bathrooms int,
  amenities text[],
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.accommodation_name,
    h.description,
    h.location,
    h.place,
    h.type,
    h.price_per_night,
    h.max_person,
    h.bedrooms,
    h.bathrooms,
    h.amenities,
    ts_rank(h.search_vector, websearch_to_tsquery('english', search_query)) as rank
  FROM houses h
  WHERE h.is_published = true
    AND h.search_vector @@ websearch_to_tsquery('english', search_query)
  ORDER BY rank DESC, h.created_at DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Add comment explaining the search_vector structure
COMMENT ON COLUMN houses.search_vector IS 'Full-text search vector with weighted fields: A=name/location, B=description/type, C=amenities/region, D=street';
