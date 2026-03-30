# Semantic Search Implementation Guide

## Overview
This document describes the semantic search functionality implemented for cottage listings using PostgreSQL's full-text search capabilities.

## Features

### 1. Automatic Search Vector Generation
- **Trigger-based**: Search vectors are automatically generated when cottages are added or edited
- **Weighted Fields**: Different fields have different importance in search results:
  - **Weight A (Highest)**: `accommodation_name`, `location`, `place`
  - **Weight B**: `description`, `type`
  - **Weight C**: `amenities`, `region`
  - **Weight D (Lowest)**: `street`

### 2. Intelligent Search
- Uses PostgreSQL's `websearch_to_tsquery` for natural language queries
- Supports multi-word searches, phrases, and boolean operators
- Returns ranked results based on relevance

### 3. Search Capabilities
Users can search for cottages using:
- **Location names**: "Amsterdam", "countryside near Utrecht"
- **Property types**: "cabin", "treehouse", "cottage"
- **Amenities**: "wifi pool fireplace", "pet friendly"
- **Descriptions**: "romantic getaway", "family vacation"
- **Natural language**: "cozy cabin with fireplace near mountains"

## Database Schema

### New Column
```sql
ALTER TABLE houses
ADD COLUMN search_vector tsvector;
```

### Index
```sql
CREATE INDEX idx_houses_search_vector ON houses USING GIN(search_vector);
```

### Automatic Update Trigger
The `houses_search_vector_trigger` automatically updates the search vector on INSERT or UPDATE operations.

## API Endpoint

### `/api/search`

**Method**: GET

**Parameters**:
- `q` (required): Search query string
- `limit` (optional): Maximum number of results (default: 20)

**Example Request**:
```
GET /api/search?q=cozy+cabin+with+fireplace&limit=10
```

**Response**:
```json
{
  "success": true,
  "results": [
    {
      "id": 123,
      "accommodation_name": "Cozy Mountain Cabin",
      "description": "Beautiful cabin with fireplace...",
      "location": "Austrian Alps",
      "place": "Innsbruck",
      "type": "cabin",
      "price_per_night": 120,
      "max_person": 4,
      "bedrooms": 2,
      "bathrooms": 1,
      "amenities": ["fireplace", "wifi", "mountain-view"],
      "images": ["url1.jpg", "url2.jpg"],
      "rank": 0.8567
    }
  ],
  "count": 1
}
```

## Search Page Integration

### URL Parameters
- `?q=search+term` - Uses semantic search
- `?location=place` - Also uses semantic search
- No parameters - Shows all listings

### Example URLs
```
/en/search?q=romantic+treehouse
/en/search?location=Amsterdam
/en/search?q=pet+friendly+cabin&guests=4
```

## How It Works

### 1. When Cottage is Added/Edited
```
User saves cottage → Database trigger fires → Search vector automatically generated
```

### 2. When User Searches
```
User enters search → API receives query → PostgreSQL full-text search → Ranked results returned
```

### 3. Search Vector Generation
The search vector combines all relevant fields:
```sql
setweight(to_tsvector('english', accommodation_name), 'A') ||
setweight(to_tsvector('english', description), 'B') ||
setweight(to_tsvector('english', location), 'A') ||
...
```

## Database Function

### `search_houses(search_query text, max_results int)`
Performs semantic search and returns ranked results.

**Usage in SQL**:
```sql
SELECT * FROM search_houses('cozy cabin fireplace', 10);
```

**Usage in Supabase**:
```javascript
const { data } = await supabase.rpc('search_houses', {
  search_query: 'cozy cabin fireplace',
  max_results: 10
});
```

## Migration Files

1. **`20240328000001_add_semantic_search_to_houses.sql`**
   - Adds `search_vector` column
   - Creates GIN index for fast searching
   - Creates trigger for automatic updates
   - Updates existing records
   - Creates `search_houses()` function

## Testing

### Test Queries
```
1. "cabin with fireplace" - Should find cabins with fireplaces
2. "Amsterdam" - Should find properties in Amsterdam
3. "romantic getaway" - Should find romantic properties
4. "pet friendly wifi" - Should find properties with both amenities
5. "treehouse forest" - Should find treehouses in forest locations
```

### Expected Behavior
- Results are ranked by relevance
- More specific queries return fewer, more relevant results
- Location names are prioritized
- Property names and descriptions are weighted appropriately

## Performance

- **GIN Index**: Provides fast full-text search even with thousands of listings
- **Automatic Updates**: No manual intervention needed when cottages are modified
- **Efficient Ranking**: PostgreSQL's built-in ranking algorithm is highly optimized

## Benefits

1. **Natural Language Search**: Users can search as they naturally speak
2. **Automatic**: No manual tagging or categorization needed
3. **Fast**: GIN index ensures quick results even with large datasets
4. **Relevant**: Weighted fields ensure most relevant results appear first
5. **Maintenance-Free**: Automatically updates when cottages are edited

## Future Enhancements

Potential improvements:
- Multi-language support (Dutch, German, French)
- Synonym handling (e.g., "cottage" = "cabin" = "hut")
- Fuzzy matching for typos
- Search analytics to improve ranking
- Personalized results based on user preferences
