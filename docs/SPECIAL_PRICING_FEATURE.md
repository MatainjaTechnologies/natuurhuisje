# Special Pricing Feature Documentation

## Overview

The Special Pricing feature allows hosts to set different prices for specific date ranges (holidays, weekends, peak seasons, etc.). When guests book during these periods, they will see the revised pricing automatically calculated and displayed with a detailed breakdown.

## Features

### For Hosts
- **Create Special Pricing Periods**: Set custom prices for specific date ranges
- **Occasion Names**: Label pricing periods (e.g., "Christmas", "Summer Peak", "New Year")
- **Price Comparison**: See percentage difference from regular pricing
- **Overlap Prevention**: System prevents overlapping date ranges
- **Easy Management**: Edit or delete special pricing periods

### For Guests
- **Automatic Price Calculation**: Prices are calculated automatically based on selected dates
- **Transparent Pricing**: See daily price breakdown showing which days have special pricing
- **Clear Indicators**: Visual indicators show when special pricing applies
- **Detailed Breakdown**: View regular vs. special pricing in the booking summary

## Database Schema

### `special_pricing` Table

```sql
- id: BIGSERIAL PRIMARY KEY
- house_id: BIGINT (references houses table)
- start_date: DATE
- end_date: DATE
- price_per_night: DECIMAL(10, 2)
- occasion_name: VARCHAR(255) (optional)
- description: TEXT (optional)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Constraints:**
- Start date must be before or equal to end date
- Price must be positive
- Date ranges cannot overlap for the same house
- Only house owners can manage their special pricing

## API Endpoints

### GET `/api/special-pricing?house_id={id}`
Fetch all special pricing periods for a house.

**Response:**
```json
[
  {
    "id": 1,
    "house_id": 123,
    "start_date": "2024-12-24",
    "end_date": "2024-12-26",
    "price_per_night": 250.00,
    "occasion_name": "Christmas",
    "description": "Holiday premium pricing"
  }
]
```

### POST `/api/special-pricing`
Create a new special pricing period.

**Request Body:**
```json
{
  "house_id": 123,
  "start_date": "2024-12-24",
  "end_date": "2024-12-26",
  "price_per_night": 250.00,
  "occasion_name": "Christmas",
  "description": "Holiday premium pricing"
}
```

### PUT `/api/special-pricing/{id}`
Update an existing special pricing period.

### DELETE `/api/special-pricing/{id}`
Delete a special pricing period.

### GET `/api/booking-price`
Calculate total booking price with special pricing.

**Query Parameters:**
- `house_id`: House ID
- `check_in`: Check-in date (YYYY-MM-DD)
- `check_out`: Check-out date (YYYY-MM-DD)
- `regular_price`: Regular price per night

**Response:**
```json
{
  "regularNights": 3,
  "regularPrice": 300.00,
  "specialNights": 2,
  "specialPrice": 500.00,
  "totalNights": 5,
  "totalPrice": 800.00,
  "priceBreakdown": [
    {
      "date": "2024-12-24",
      "price": 250.00,
      "isSpecialPrice": true,
      "occasionName": "Christmas"
    }
  ]
}
```

## Components

### `SpecialPricingManager`
Host-facing component for managing special pricing periods.

**Usage:**
```tsx
import SpecialPricingManager from '@/components/host/SpecialPricingManager';

<SpecialPricingManager 
  houseId={123} 
  regularPrice={100} 
/>
```

### `BookingBoxWithSpecialPricing`
Guest-facing booking component with special pricing support.

**Usage:**
```tsx
import { BookingBoxWithSpecialPricing } from '@/components/BookingBoxWithSpecialPricing';

<BookingBoxWithSpecialPricing
  houseId={123}
  pricePerNight={100}
  rating={4.8}
  reviewCount={42}
/>
```

## Integration Guide

### Step 1: Run Database Migration

```bash
# Apply the migration to create the special_pricing table
psql -d your_database -f supabase/migrations/20240325000001_create_special_pricing_table.sql
```

### Step 2: Add Special Pricing Manager to Host Dashboard

In your listing edit page or host dashboard:

```tsx
import SpecialPricingManager from '@/components/host/SpecialPricingManager';

// Inside your component
<SpecialPricingManager 
  houseId={listing.id} 
  regularPrice={listing.price_per_night} 
/>
```

### Step 3: Replace BookingBox with BookingBoxWithSpecialPricing

In your property detail page:

```tsx
// Before
import { BookingBox } from '@/components/BookingBox';

// After
import { BookingBoxWithSpecialPricing } from '@/components/BookingBoxWithSpecialPricing';

// Usage
<BookingBoxWithSpecialPricing
  houseId={house.id}
  pricePerNight={house.price_per_night}
  rating={house.avg_rating}
  reviewCount={house.review_count}
/>
```

### Step 4: Update Booking Creation Logic

When creating bookings, use the calculated price from the API:

```tsx
const response = await fetch(
  `/api/booking-price?house_id=${houseId}&check_in=${checkIn}&check_out=${checkOut}&regular_price=${regularPrice}`
);
const priceCalculation = await response.json();

// Use priceCalculation.totalPrice for the booking
```

## Library Functions

### `calculateBookingPrice()`
Calculate booking price with special pricing applied.

```typescript
import { calculateBookingPrice } from '@/lib/supabase-special-pricing';

const calculation = await calculateBookingPrice(
  houseId,
  regularPricePerNight,
  checkInDate,
  checkOutDate
);
```

### `getSpecialPricingForHouse()`
Get all special pricing periods for a house.

```typescript
import { getSpecialPricingForHouse } from '@/lib/supabase-special-pricing';

const specialPricing = await getSpecialPricingForHouse(houseId);
```

### `createSpecialPricing()`
Create a new special pricing period.

```typescript
import { createSpecialPricing } from '@/lib/supabase-special-pricing';

const newPricing = await createSpecialPricing({
  house_id: 123,
  start_date: '2024-12-24',
  end_date: '2024-12-26',
  price_per_night: 250.00,
  occasion_name: 'Christmas'
});
```

## Security

- **Row Level Security (RLS)**: Enabled on the `special_pricing` table
- **Ownership Verification**: Only house owners can create/update/delete special pricing
- **Public Read Access**: Anyone can view special pricing (needed for booking calculations)
- **Overlap Prevention**: Database constraint prevents overlapping date ranges

## Best Practices

1. **Set Special Pricing in Advance**: Add special pricing periods well before the dates
2. **Clear Occasion Names**: Use descriptive names like "Christmas Week" or "Summer Peak"
3. **Reasonable Pricing**: Avoid extreme price differences that might deter bookings
4. **Regular Updates**: Review and update special pricing seasonally
5. **Communicate Changes**: Inform existing bookings if prices change

## Example Use Cases

### Holiday Pricing
```typescript
{
  occasion_name: "Christmas Week",
  start_date: "2024-12-24",
  end_date: "2024-12-31",
  price_per_night: 250.00
}
```

### Weekend Premium
```typescript
{
  occasion_name: "Weekend Premium",
  start_date: "2024-06-07", // Friday
  end_date: "2024-06-09",   // Sunday
  price_per_night: 150.00
}
```

### Summer Peak Season
```typescript
{
  occasion_name: "Summer Peak",
  start_date: "2024-07-01",
  end_date: "2024-08-31",
  price_per_night: 180.00
}
```

## Troubleshooting

### Issue: Overlapping Date Ranges Error
**Solution**: Check existing special pricing periods and ensure new dates don't overlap.

### Issue: Special Pricing Not Showing
**Solution**: Verify the date range includes the booking dates and the special pricing is active.

### Issue: Price Calculation Incorrect
**Solution**: Check that the regular price is passed correctly to the calculation function.

### Issue: Permission Denied
**Solution**: Ensure the user is authenticated and owns the house they're trying to modify.

## Future Enhancements

- **Recurring Special Pricing**: Set pricing that repeats (e.g., every weekend)
- **Bulk Import**: Upload CSV files with multiple pricing periods
- **Price Templates**: Save and reuse common pricing patterns
- **Analytics**: Track revenue impact of special pricing
- **Dynamic Pricing**: AI-suggested pricing based on demand
